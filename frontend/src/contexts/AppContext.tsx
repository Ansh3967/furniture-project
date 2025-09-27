import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export type UserRole = 'user' | 'seller' | 'buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
}

export interface Furniture {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  type: 'sell' | 'rent' | 'both';
  price?: number;
  rentPrice?: number;
  deposit?: number;
  availability: boolean;
  sellerId: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  furniture: Furniture;
  quantity: number;
  type: 'sell' | 'rent';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  type: 'purchase' | 'rental';
  createdAt: string;
  dueDate?: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  cart: CartItem[];
  wishlist: string[];
  furniture: Furniture[];
  orders: Order[];
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  typeFilter: 'all' | 'sell' | 'rent';
}

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'SET_TYPE_FILTER'; payload: 'all' | 'sell' | 'rent' }
  | { type: 'ADD_FURNITURE'; payload: Furniture }
  | { type: 'UPDATE_FURNITURE'; payload: Furniture }
  | { type: 'DELETE_FURNITURE'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order };

// Sample furniture data
const sampleFurniture: Furniture[] = [
  {
    id: '1',
    title: 'Premium Leather Sofa',
    description: 'Luxurious 3-seater leather sofa with premium craftsmanship',
    category: 'Sofa',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 2499,
    rentPrice: 199,
    deposit: 500,
    availability: true,
    sellerId: 'seller1',
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: '2',
    title: 'Walnut Executive Desk',
    description: 'Professional walnut desk perfect for home office',
    category: 'Desk',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 1299,
    rentPrice: 89,
    deposit: 200,
    availability: true,
    sellerId: 'seller2',
    rating: 4.6,
    reviewCount: 18
  },
  {
    id: '3',
    title: 'Ergonomic Office Chair',
    description: 'High-back ergonomic chair with lumbar support',
    category: 'Chair',
    images: ['/placeholder.svg'],
    type: 'sell',
    price: 599,
    availability: true,
    sellerId: 'seller1',
    rating: 4.7,
    reviewCount: 32
  }
];

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  wishlist: [],
  furniture: sampleFurniture,
  orders: [],
  searchQuery: '',
  selectedCategory: 'all',
  priceRange: [0, 5000],
  typeFilter: 'all'
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    
    case 'LOGOUT':
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        wishlist: []
      };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(
        item => item.furniture.id === action.payload.furniture.id && item.type === action.payload.type
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.furniture.id === action.payload.furniture.id && item.type === action.payload.type
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.furniture.id !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.furniture.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.payload)
      };
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
    
    case 'SET_CATEGORY_FILTER':
      return {
        ...state,
        selectedCategory: action.payload
      };
    
    case 'SET_PRICE_RANGE':
      return {
        ...state,
        priceRange: action.payload
      };
    
    case 'SET_TYPE_FILTER':
      return {
        ...state,
        typeFilter: action.payload
      };
    
    case 'ADD_FURNITURE':
      return {
        ...state,
        furniture: [...state.furniture, action.payload]
      };
    
    case 'UPDATE_FURNITURE':
      return {
        ...state,
        furniture: state.furniture.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case 'DELETE_FURNITURE':
      return {
        ...state,
        furniture: state.furniture.filter(item => item.id !== action.payload)
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize user from localStorage
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}