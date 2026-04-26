import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'americanDemoFood.cart'

const initialState = {
  restaurant: null,
  items: [],
}

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return parsed?.items ? parsed : initialState
  } catch {
    return initialState
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'BOOTSTRAP':
      return action.payload
    case 'ADD_ITEM': {
      const { restaurant, item } = action.payload
      const isDifferentRestaurant = state.restaurant?.id && state.restaurant.id !== restaurant.id
      const baseItems = isDifferentRestaurant ? [] : state.items
      const existing = baseItems.find((entry) => entry.id === item.id)

      return {
        restaurant,
        items: existing
          ? baseItems.map((entry) =>
              entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
            )
          : [
              ...baseItems,
              {
                id: item.id,
                name: item.name,
                priceCents: item.priceCents,
                category: item.category,
                quantity: 1,
              },
            ],
      }
    }
    case 'SET_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(1, action.payload.quantity) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: 'BOOTSTRAP', payload: loadCart() })
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
    const deliveryFee = subtotal > 0 && subtotal < 5000 ? 499 : 0
    const total = subtotal + deliveryFee

    return {
      restaurant: state.restaurant,
      items: state.items,
      count: state.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      deliveryFee,
      total,
      addItem: (restaurant, item) => dispatch({ type: 'ADD_ITEM', payload: { restaurant, item } }),
      increment: (id) => {
        const current = state.items.find((item) => item.id === id)
        if (current) {
          dispatch({ type: 'SET_QUANTITY', payload: { id, quantity: current.quantity + 1 } })
        }
      },
      decrement: (id) => {
        const current = state.items.find((item) => item.id === id)
        if (current) {
          dispatch({ type: 'SET_QUANTITY', payload: { id, quantity: current.quantity - 1 } })
        }
      },
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
