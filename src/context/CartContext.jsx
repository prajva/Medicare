import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext({})

const CART_STORAGE_KEY = 'medicare_cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.item.id)
      if (existing) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...state, { ...action.item, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) return state.filter(i => i.id !== action.id)
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      )
    }
    case 'CLEAR_CART':
      return []
    case 'LOAD_CART':
      return action.cart
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addItem    = (item) => dispatch({ type: 'ADD_ITEM', item })
  const removeItem = (id)   => dispatch({ type: 'REMOVE_ITEM', id })
  const updateQty  = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  const clearCart  = ()     => dispatch({ type: 'CLEAR_CART' })

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const total     = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
