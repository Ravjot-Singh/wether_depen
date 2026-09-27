import credits from '../menu/credits.json'
import { ITEMS } from '../menu/items.js'

export default function Credits() {
  return (
    <footer className="glass credits">
      <details>
        <summary>Image credits (Wikimedia Commons)</summary>
        <ul>
          {ITEMS.filter((item) => credits[item.id]).map((item) => {
            const c = credits[item.id]
            return (
              <li key={item.id}>
                <strong>{item.name}:</strong>{' '}
                <a href={c.source} target="_blank" rel="noreferrer">
                  {c.title.replace(/^File:/, '')}
                </a>{' '}
                by {c.author},{' '}
                {c.licenseUrl ? (
                  <a href={c.licenseUrl} target="_blank" rel="noreferrer">
                    {c.license}
                  </a>
                ) : (
                  c.license
                )}
              </li>
            )
          })}
        </ul>
      </details>
    </footer>
  )
}
