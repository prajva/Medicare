import { createContext, useContext, useReducer, useEffect } from 'react'

const WishlistContext = createContext({})

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return state.find(i => i.id === action.item.id)
        ? state.filter(i => i.id !== action.item.id)
        : [...state, action.item]
    case 'REMOVE': return state.filter(i => i.id !== action.id)
    case 'CLEAR':  return []
    default:       return state
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, dispatch] = useReducer(reducer, [], () => {
    try { return JSON.parse(localStorage.getItem('medicare_wishlist') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('medicare_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggle      = item => dispatch({ type: 'TOGGLE', item })
  const isWishlisted = id  => wishlist.some(i => i.id === id)
  const remove       = id  => dispatch({ type: 'REMOVE', id })
  const clear        = ()  => dispatch({ type: 'CLEAR' })

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted, remove, clear }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
