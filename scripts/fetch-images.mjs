import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { ITEMS } from '../src/menu/items.js'

const API = 'https://commons.wikimedia.org/w/api.php'
const UA = 'WeatherBites/0.1 (local demo app; image fetch script)'
const OUT_DIR = new URL('../public/food/', import.meta.url)
const CREDITS = new URL('../src/menu/credits.json', import.meta.url)
const OK_LICENSE = /^(cc0|public domain|pd|cc by(-sa)? \d)/i

const SEARCH = {
  'masala-chai': 'masala chai cup',
  pakora: 'onion pakora',
  samosa: 'samosa chutney',
  'masala-noodles': 'maggi noodles',
  bhutta: 'roasted corn cob india',
  'vada-pav': 'vada pav',
  'tomato-soup': 'tomato soup bowl',
  'aloo-paratha': 'aloo paratha',
  momos: 'momos dumplings',
  'hot-chocolate': 'hot chocolate mug',
  'gajar-halwa': 'gajar halwa',
  'mango-lassi': 'mango lassi',
  kulfi: 'kulfi',
  'nimbu-pani': 'lemonade mint glass',
  'cold-coffee': 'iced coffee glass',
  'watermelon-juice': 'watermelon juice glass',
  'ice-cream': 'ice cream sundae',
  'pani-puri': 'pani puri',
  pizza: 'pizza margherita',
  'masala-dosa': 'masala dosa',
  'pav-bhaji': 'pav bhaji',
  burger: 'hamburger fries',
  biryani: 'hyderabadi biryani',
  'butter-chicken': 'butter chicken',
  'chole-bhature': 'chole bhature',
  'paneer-tikka': 'paneer tikka',
  pasta: 'penne arrabbiata',
  'gulab-jamun': 'gulab jamun',
}

const PINNED = {
  'masala-noodles': 'File:Vegetable Maggi 3.jpg',
  'mango-lassi': 'File:Mango lassi at restaurant Momo & More in March 2024.jpg',
  'nimbu-pani': 'File:Neemboo-Paani (Lime Water).JPG',
  kulfi: 'File:Pista Matka Kulfi.JPG',
}

const REJECTED = new Set([
  'File:Pizza special Maggi noodles (2025).jpg',
  'File:Pancake, mango lassi and Nepalese tea at restaurant Everest Dine.jpg',
  'File:Atria steak au poivre with Crodo Limonata.jpg',
  'File:Kulfi de pistatxo.jpg',
  'File:Paan Kulfi.jpg',
])

const stripHtml = (s = '') => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function politeFetch(url, what) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.status !== 429) {
      if (!res.ok) throw new Error(`${what} ${res.status}`)
      return res
    }
    const wait = Number(res.headers.get('retry-after')) * 1000 || 5000 * 2 ** attempt
    await sleep(wait)
  }
  throw new Error(`${what} rate limited`)
}

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })}`
  return (await politeFetch(url, 'Commons API')).json()
}

const IMAGEINFO = { prop: 'imageinfo', iiprop: 'url|extmetadata|mime|size', iiurlwidth: '640' }

async function candidates(id) {
  if (PINNED[id]) {
    const data = await api({ action: 'query', titles: PINNED[id], ...IMAGEINFO })
    return data.query.pages
  }
  const data = await api({
    action: 'query',
    generator: 'search',
    gsrsearch: `${SEARCH[id]} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '15',
    ...IMAGEINFO,
  })
  return (data.query?.pages ?? []).sort((a, b) => a.index - b.index)
}

function pick(pages, pinned) {
  for (const page of pages) {
    const info = page.imageinfo?.[0]
    if (!info || REJECTED.has(page.title)) continue
    if (info.mime !== 'image/jpeg') continue
    const ratio = info.width / info.height
    if (!pinned && (info.width < 640 || ratio < 0.9 || ratio > 2)) continue
    const meta = info.extmetadata ?? {}
    const license = meta.LicenseShortName?.value ?? ''
    if (!OK_LICENSE.test(license)) continue
    return {
      title: page.title,
      author: stripHtml(meta.Artist?.value) || 'Unknown',
      license,
      licenseUrl: meta.LicenseUrl?.value ?? null,
      source: info.descriptionurl,
      thumb: info.thumburl,
    }
  }
  return null
}

const exists = (url) => access(url).then(() => true, () => false)

async function main() {
  const args = process.argv.slice(2)
  const all = args.includes('--all')
  const only = args.filter((a) => !a.startsWith('--'))

  await mkdir(OUT_DIR, { recursive: true })
  const credits = JSON.parse(await readFile(CREDITS, 'utf8').catch(() => '{}'))
  const missing = []

  for (const item of ITEMS) {
    const file = new URL(`${item.id}.jpg`, OUT_DIR)
    const wanted = all || only.includes(item.id) || (only.length === 0 && !(await exists(file)))
    if (!wanted) continue

    try {
      const choice = pick(await candidates(item.id), Boolean(PINNED[item.id]))
      if (!choice) {
        missing.push(item.id)
        console.warn(`✗ ${item.id}: no suitable image`)
        continue
      }
      const res = await politeFetch(choice.thumb, 'download')
      await writeFile(file, Buffer.from(await res.arrayBuffer()))
      const { thumb, ...credit } = choice
      credits[item.id] = credit
      console.log(`✓ ${item.id}: ${choice.title} (${choice.license})`)
    } catch (err) {
      missing.push(item.id)
      console.warn(`✗ ${item.id}: ${err.message}`)
    }
    await sleep(1500)
  }

  const ordered = Object.fromEntries(ITEMS.filter((i) => credits[i.id]).map((i) => [i.id, credits[i.id]]))
  await writeFile(CREDITS, JSON.stringify(ordered, null, 2) + '\n')
  console.log(missing.length ? `\nMissing: ${missing.join(', ')}` : '\nAll images present.')
}

main()
