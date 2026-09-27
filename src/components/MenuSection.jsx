import FoodCard from './FoodCard.jsx'
import { CATEGORIES, ITEMS } from '../menu/items.js'

export default function MenuSection({ specialIds }) {
  return (
    <section className="menu-section" aria-labelledby="menu-title">
      <h2 id="menu-title" className="section-title">
        Full Menu
      </h2>
      {CATEGORIES.map((cat) => (
        <div key={cat.id} className="category">
          <h3 className="category-title">{cat.label}</h3>
          <div className="food-grid">
            {ITEMS.filter((item) => item.category === cat.id).map((item) => (
              <FoodCard key={item.id} item={item} special={specialIds.has(item.id)} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
