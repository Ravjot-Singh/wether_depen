export const CATEGORIES = [
  { id: 'snacks', label: 'Snacks & Street Food' },
  { id: 'meals', label: 'Meals' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'desserts', label: 'Desserts' },
]

export const ITEMS = [
  { id: 'masala-chai', name: 'Masala Chai', category: 'drinks', price: 40, veg: true, moods: ['rainy', 'cold'], description: 'Strong tea brewed with ginger, cardamom and milk.' },
  { id: 'pakora', name: 'Onion Pakora', category: 'snacks', price: 90, veg: true, moods: ['rainy'], description: 'Crispy gram-flour fritters with mint chutney.' },
  { id: 'samosa', name: 'Samosa (2 pcs)', category: 'snacks', price: 40, veg: true, moods: ['rainy'], description: 'Flaky pastry stuffed with spiced potato and peas.' },
  { id: 'masala-noodles', name: 'Masala Noodles', category: 'snacks', price: 110, veg: true, moods: ['rainy'], description: 'Instant noodles tossed with veggies and masala.' },
  { id: 'bhutta', name: 'Roasted Bhutta', category: 'snacks', price: 60, veg: true, moods: ['rainy'], description: 'Charcoal-roasted corn rubbed with lemon and chilli.' },
  { id: 'vada-pav', name: 'Vada Pav', category: 'snacks', price: 50, veg: true, moods: ['rainy'], description: "Mumbai's spiced potato fritter in a soft bun." },

  { id: 'tomato-soup', name: 'Tomato Soup', category: 'snacks', price: 120, veg: true, moods: ['cold'], description: 'Creamy roasted tomato soup with croutons.' },
  { id: 'aloo-paratha', name: 'Aloo Paratha', category: 'meals', price: 130, veg: true, moods: ['cold'], description: 'Potato-stuffed flatbread with butter, curd and pickle.' },
  { id: 'momos', name: 'Steamed Momos', category: 'snacks', price: 140, veg: true, moods: ['cold'], description: 'Veg dumplings with fiery red chutney.' },
  { id: 'hot-chocolate', name: 'Hot Chocolate', category: 'drinks', price: 150, veg: true, moods: ['cold'], description: 'Rich cocoa with steamed milk.' },
  { id: 'gajar-halwa', name: 'Gajar ka Halwa', category: 'desserts', price: 120, veg: true, moods: ['cold'], description: 'Slow-cooked carrot pudding with ghee and nuts.' },

  { id: 'mango-lassi', name: 'Mango Lassi', category: 'drinks', price: 110, veg: true, moods: ['hot'], description: 'Chilled yoghurt blended with Alphonso mango.' },
  { id: 'kulfi', name: 'Kulfi', category: 'desserts', price: 80, veg: true, moods: ['hot'], description: 'Dense frozen milk dessert with pistachio.' },
  { id: 'nimbu-pani', name: 'Nimbu Pani', category: 'drinks', price: 50, veg: true, moods: ['hot'], description: 'Fresh lemonade with black salt and mint.' },
  { id: 'cold-coffee', name: 'Cold Coffee', category: 'drinks', price: 140, veg: true, moods: ['hot'], description: 'Iced coffee shaken with milk and ice cream.' },
  { id: 'watermelon-juice', name: 'Watermelon Juice', category: 'drinks', price: 90, veg: true, moods: ['hot'], description: 'Freshly pressed, served over ice.' },
  { id: 'ice-cream', name: 'Ice Cream Sundae', category: 'desserts', price: 160, veg: true, moods: ['hot'], description: 'Three scoops with chocolate sauce and nuts.' },

  { id: 'pani-puri', name: 'Pani Puri', category: 'snacks', price: 60, veg: true, moods: ['pleasant'], description: 'Crisp puris with tangy tamarind and mint water.' },
  { id: 'pizza', name: 'Margherita Pizza', category: 'meals', price: 299, veg: true, moods: ['pleasant'], description: 'Wood-fired with tomato, mozzarella and basil.' },
  { id: 'masala-dosa', name: 'Masala Dosa', category: 'meals', price: 140, veg: true, moods: ['pleasant'], description: 'Crisp rice crepe with potato filling, sambar and chutney.' },
  { id: 'pav-bhaji', name: 'Pav Bhaji', category: 'meals', price: 150, veg: true, moods: ['pleasant'], description: 'Buttery mashed vegetable curry with toasted buns.' },
  { id: 'burger', name: 'Classic Burger', category: 'meals', price: 199, veg: false, moods: ['pleasant'], description: 'Grilled chicken patty, cheese, lettuce and fries.' },

  { id: 'biryani', name: 'Hyderabadi Biryani', category: 'meals', price: 280, veg: false, moods: [], description: 'Dum-cooked basmati rice with spiced chicken.' },
  { id: 'butter-chicken', name: 'Butter Chicken', category: 'meals', price: 320, veg: false, moods: [], description: 'Tandoori chicken in a silky tomato-butter gravy.' },
  { id: 'chole-bhature', name: 'Chole Bhature', category: 'meals', price: 180, veg: true, moods: [], description: 'Spicy chickpea curry with fluffy fried bread.' },
  { id: 'paneer-tikka', name: 'Paneer Tikka', category: 'snacks', price: 220, veg: true, moods: [], description: 'Chargrilled cottage cheese marinated in spices.' },
  { id: 'pasta', name: 'Penne Arrabbiata', category: 'meals', price: 240, veg: true, moods: [], description: 'Penne in a spicy garlic-tomato sauce.' },
  { id: 'gulab-jamun', name: 'Gulab Jamun', category: 'desserts', price: 90, veg: true, moods: [], description: 'Warm milk dumplings soaked in rose syrup.' },
].map((item) => ({ ...item, image: `/food/${item.id}.jpg` }))

export const DISCOUNT = 0.5

export const discounted = (price) => Math.round(price * (1 - DISCOUNT))

export const specialsFor = (mood) => ITEMS.filter((item) => item.moods.includes(mood))
