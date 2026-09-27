import { conditionGroup } from '../theme/resolveTheme.js'

const CLOUD = 'M16 46A9 9 0 0 1 17 28A13 13 0 0 1 42 24A10 10 0 0 1 48 46Z'

function Sun({ x = 32, y = 32, r = 11 }) {
  return (
    <g className="i-sun">
      <g className="i-rays" style={{ transformOrigin: `${x}px ${y}px` }}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4
          return (
            <line
              key={i}
              x1={x + Math.cos(a) * (r + 4)}
              y1={y + Math.sin(a) * (r + 4)}
              x2={x + Math.cos(a) * (r + 9)}
              y2={y + Math.sin(a) * (r + 9)}
            />
          )
        })}
      </g>
      <circle cx={x} cy={y} r={r} />
    </g>
  )
}

function Moon({ x = 32, y = 32, s = 1 }) {
  return (
    <path
      className="i-moon"
      transform={`translate(${x - 32 * s} ${y - 32 * s}) scale(${s})`}
      d="M38 14a18 18 0 1 0 12 30A15 15 0 0 1 38 14z"
    />
  )
}

function Cloud({ dark, dx = 0, dy = 0 }) {
  return <path className={dark ? 'i-cloud dark' : 'i-cloud'} d={CLOUD} transform={`translate(${dx} ${dy})`} />
}

export default function WeatherIcon({ id, isDay = true, size = 48, label }) {
  const group = conditionGroup(id)
  const partly = id === 801 || id === 802
  const body = (() => {
    switch (group) {
      case 'clear':
        return isDay ? <Sun r={12} /> : <Moon />
      case 'clouds':
        return partly ? (
          <>
            {isDay ? <Sun x={24} y={22} r={9} /> : <Moon x={24} y={20} s={0.65} />}
            <Cloud dx={4} dy={6} />
          </>
        ) : (
          <>
            <Cloud dark dx={6} dy={-4} />
            <Cloud dy={4} />
          </>
        )
      case 'rain':
      case 'drizzle':
        return (
          <>
            <Cloud dark={group === 'rain'} dy={-6} />
            <g className={group === 'rain' ? 'i-rain' : 'i-rain light'}>
              <line x1="22" y1="46" x2="19" y2="54" />
              <line x1="32" y1="46" x2="29" y2="54" />
              <line x1="42" y1="46" x2="39" y2="54" />
            </g>
          </>
        )
      case 'thunder':
        return (
          <>
            <Cloud dark dy={-8} />
            <polygon className="i-bolt" points="34,36 25,50 31,50 27,62 40,45 33,45 37,36" />
          </>
        )
      case 'snow':
        return (
          <>
            <Cloud dy={-6} />
            <g className="i-snow">
              <circle cx="22" cy="50" r="2.4" />
              <circle cx="32" cy="54" r="2.4" />
              <circle cx="42" cy="50" r="2.4" />
            </g>
          </>
        )
      case 'fog':
      default:
        return (
          <>
            <Cloud dy={-10} />
            <g className="i-fog">
              <line x1="12" y1="44" x2="46" y2="44" />
              <line x1="18" y1="51" x2="52" y2="51" />
              <line x1="14" y1="58" x2="40" y2="58" />
            </g>
          </>
        )
    }
  })()

  return (
    <svg className="wicon" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={label}>
      {body}
    </svg>
  )
}
