import { DISCOUNT, discounted } from '../menu/items.js'
import { rupees } from '../utils/format.js'

function VegMark({ veg }) {
  const label = veg ? 'Vegetarian' : 'Non-vegetarian'
  return <span className={veg ? 'veg-mark veg' : 'veg-mark nonveg'} role="img" aria-label={label} title={label} />
}

export default function FoodCard({ item, special, style }) {
  return (
    <article className={special ? 'glass food special' : 'glass food'} style={style}>
      <div className="food-img">
        <img src={item.image} alt={item.name} loading="lazy" width="640" height="480" />
        {special && <span className="ribbon">{DISCOUNT * 100}% OFF</span>}
      </div>
      <div className="food-body">
        <h3 className="food-name">
          <VegMark veg={item.veg} />
          {item.name}
        </h3>
        <p className="food-desc muted">{item.description}</p>
        <p className="price">
          {special ? (
            <>
              <s className="muted">{rupees(item.price)}</s>
              <strong className="price-now">{rupees(discounted(item.price))}</strong>
            </>
          ) : (
            <strong>{rupees(item.price)}</strong>
          )}
        </p>
      </div>
    </article>
  )
}
