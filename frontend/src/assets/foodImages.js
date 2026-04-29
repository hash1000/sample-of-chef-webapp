import cuisineFastFood from './cuisine-fast-food.png'
import cuisineGrill from './cuisine-grill.png'
import cuisinePakistani from './cuisine-pakistani.png'
import cuisineSeafood from './cuisine-seafood.png'
import foodHeroBanner from './food-hero-banner.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:4000'

export const heroBannerImage = foodHeroBanner

export const cuisineImages = [
  {
    key: 'Pakistani',
    title: 'Pakistani',
    subtitle: 'Biryani, karahi, naan',
    image: cuisinePakistani,
  },
  {
    key: 'Seafood',
    title: 'Seafood',
    subtitle: 'Fish, prawns, coastal plates',
    image: cuisineSeafood,
  },
  {
    key: 'Grill',
    title: 'Grill',
    subtitle: 'BBQ, kebabs, platters',
    image: cuisineGrill,
  },
  {
    key: 'Fast Food',
    title: 'Fast Food',
    subtitle: 'Wraps, burgers, fries',
    image: cuisineFastFood,
  },
]

const imageByCuisine = {
  bbq: cuisineGrill,
  bread: cuisinePakistani,
  curry: cuisinePakistani,
  'fast food': cuisineFastFood,
  grill: cuisineGrill,
  pakistani: cuisinePakistani,
  rice: cuisinePakistani,
  salad: cuisineGrill,
  seafood: cuisineSeafood,
  tandoor: cuisinePakistani,
  wraps: cuisineFastFood,
}

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return ''
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl
  return `${API_BASE_URL}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`
}

export function imageForCuisine(value) {
  return imageByCuisine[normalize(value)] || cuisinePakistani
}

export function imageForRestaurant(restaurant) {
  return resolveImageUrl(restaurant?.bannerImageUrl)
    || imageForCuisine(restaurant?.menuType || restaurant?.menuItems?.[0]?.category)
}

export function imageForMenuItem(item) {
  return resolveImageUrl(item?.imageUrl) || imageForCuisine(item?.category)
}
