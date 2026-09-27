import FoodCard from './FoodCard.jsx'

export default function SpecialsSection({ mood, items }) {
  return (
    <section className="menu-section" aria-labelledby="specials-title">
      <h2 id="specials-title" className="section-title">
        Weather Specials <span className="section-note">50% off while the weather lasts</span>
      </h2>
      <div key={mood} className="food-grid specials-grid">
        {items.map((item, i) => (
          <FoodCard key={item.id} item={item} special style={{ animationDelay: `${i * 70}ms` }} />
        ))}
      </div>
    </section>
  )
}
