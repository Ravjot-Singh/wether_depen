import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

const rand = (a, b) => a + Math.random() * (b - a)
const SLANT = 0.16

function spawn(type, w, h, anywhere) {
  switch (type) {
    case 'rain':
      return { type, x: rand(-0.2 * w, w), y: anywhere ? rand(0, h) : rand(-60, -10), len: rand(14, 26), speed: rand(15, 22) }
    case 'drizzle':
      return { type, x: rand(-0.1 * w, w), y: anywhere ? rand(0, h) : rand(-30, -5), len: rand(6, 11), speed: rand(6, 9) }
    case 'snow':
      return {
        type,
        x: rand(0, w),
        y: anywhere ? rand(0, h) : rand(-20, -5),
        r: rand(1.2, 3.6),
        speed: rand(0.5, 1.6),
        phase: rand(0, Math.PI * 2),
        sway: rand(0.2, 0.8),
      }
    case 'stars':
      return { type, x: rand(0, w), y: rand(0, h * 0.75), r: rand(0.4, 1.5), phase: rand(0, Math.PI * 2), rate: rand(0.6, 2) }
    default:
      return null
  }
}

function useParticles(canvasRef, particles, color, disabled) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || disabled || Object.keys(particles).length === 0) return
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let list = []
    let raf = 0
    let last = performance.now()

    const build = () => {
      const scale = (w * h) / (1280 * 800)
      list = []
      for (const [type, count] of Object.entries(particles)) {
        const n = Math.round(count * Math.min(scale, 1.6))
        for (let i = 0; i < n; i++) list.push(spawn(type, w, h, true))
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    const frame = (now) => {
      const dt = Math.min((now - last) / 16.67, 3)
      last = now
      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = color
      ctx.lineCap = 'round'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      for (let i = 0; i < list.length; i++) {
        const p = list[i]
        if (p.type !== 'rain' && p.type !== 'drizzle') continue
        p.y += p.speed * dt
        p.x += p.speed * SLANT * dt
        if (p.y - p.len > h) list[i] = spawn(p.type, w, h, false)
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - p.len * SLANT, p.y - p.len)
      }
      ctx.stroke()

      ctx.fillStyle = color
      ctx.beginPath()
      for (let i = 0; i < list.length; i++) {
        const p = list[i]
        if (p.type !== 'snow') continue
        p.y += p.speed * dt
        p.x += Math.sin(now * 0.001 + p.phase) * p.sway * dt
        if (p.y - p.r > h) list[i] = spawn('snow', w, h, false)
        ctx.moveTo(p.x + p.r, p.y)
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      }
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      for (const p of list) {
        if (p.type !== 'stars') continue
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(now * 0.001 * p.rate + p.phase))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ctx.clearRect(0, 0, w, h)
    }
  }, [canvasRef, particles, color, disabled])
}

function makeBolt() {
  const pts = [[0, 0]]
  let x = 0
  for (let y = 0; y < 100; ) {
    y += rand(6, 12)
    x += rand(-9, 9)
    pts.push([x, Math.min(y, 100)])
  }
  return { left: rand(10, 85), points: pts.map(([px, py]) => `${px + 30},${py}`).join(' ') }
}

function useLightning(enabled) {
  const [strike, setStrike] = useState(null)
  useEffect(() => {
    if (!enabled) return
    let t
    const schedule = () => {
      t = setTimeout(() => {
        setStrike({ id: Date.now(), bolt: Math.random() < 0.6 ? makeBolt() : null })
        schedule()
      }, rand(3000, 9000))
    }
    t = setTimeout(() => {
      setStrike({ id: Date.now(), bolt: makeBolt() })
      schedule()
    }, 1200)
    return () => clearTimeout(t)
  }, [enabled])
  return enabled ? strike : null
}

function Clouds({ count, color }) {
  const clouds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const duration = 70 + ((i * 23) % 60)
        return {
          top: 2 + ((i * 37) % 42),
          scale: 0.7 + ((i * 53) % 80) / 100,
          opacity: 0.55 + ((i * 13) % 40) / 100,
          duration,
          delay: -duration * ((i * 0.381966) % 1),
        }
      }),
    [count]
  )
  return clouds.map((c, i) => (
    <div
      key={i}
      className="cloud"
      style={{
        top: `${c.top}%`,
        '--s': c.scale,
        '--i': (i * 0.381966) % 1,
        '--cloud': color,
        opacity: c.opacity,
        animationDuration: `${c.duration}s`,
        animationDelay: `${c.delay}s`,
      }}
    />
  ))
}

export default function WeatherBackground({ themeKey, theme }) {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()
  const [prevSky, setPrevSky] = useState(theme.sky)
  const strike = useLightning(theme.lightning && !reduced)

  useParticles(canvasRef, theme.particles, theme.particleColor || '#fff', reduced)

  return (
    <div className="bg" aria-hidden="true">
      <div className="sky" style={{ background: prevSky }} />
      <div key={themeKey} className="sky fade-in" style={{ background: theme.sky }} onAnimationEnd={() => setPrevSky(theme.sky)} />

      <div key={`scene-${themeKey}`} className="scene fade-in">
        {theme.sun && (
          <div className="sun">
            <div className="sun-rays" />
            <div className="sun-core" />
          </div>
        )}
        {theme.moon && <div className="moon" />}
        {theme.clouds > 0 && <Clouds count={theme.clouds} color={theme.cloudColor} />}
        {theme.fog && (
          <>
            <div className="fog fog-1" style={{ '--fog': theme.fogColor }} />
            <div className="fog fog-2" style={{ '--fog': theme.fogColor }} />
            <div className="fog fog-3" style={{ '--fog': theme.fogColor }} />
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="particles" />

      {strike && (
        <div key={strike.id}>
          <div className="lightning" />
          {strike.bolt && (
            <svg className="bolt" style={{ left: `${strike.bolt.left}%` }} viewBox="0 0 60 100" preserveAspectRatio="none">
              <polyline points={strike.bolt.points} />
            </svg>
          )}
        </div>
      )}
    </div>
  )
}
