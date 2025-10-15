import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  role: UserRole;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  role: 'admin';
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
  admin: Admin | null;
  isAuthenticated: boolean;
  userType: 'user' | 'admin' | null;
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
  | { type: 'USER_LOGIN'; payload: User }
  | { type: 'ADMIN_LOGIN'; payload: Admin }
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

// Sample furniture data with Indian context
const sampleFurniture: Furniture[] = [
  {
    id: '1',
    title: 'Premium Leather Sofa',
    description: 'Luxurious 3-seater leather sofa with premium craftsmanship and elegant design',
    category: 'Sofa',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 24999,
    rentPrice: 1999,
    deposit: 5000,
    availability: true,
    sellerId: 'seller1',
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: '2',
    title: 'Teak Wood Executive Desk',
    description: 'Professional teak wood desk perfect for home office with spacious drawers',
    category: 'Desk',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 12999,
    rentPrice: 899,
    deposit: 2000,
    availability: true,
    sellerId: 'seller2',
    rating: 4.6,
    reviewCount: 18
  },
  {
    id: '3',
    title: 'Ergonomic Office Chair',
    description: 'High-back ergonomic chair with lumbar support and adjustable height',
    category: 'Chair',
    images: ['/placeholder.svg'],
    type: 'sell',
    price: 5999,
    availability: true,
    sellerId: 'seller1',
    rating: 4.7,
    reviewCount: 32
  },
  {
    id: '4',
    title: 'Modern Dining Table',
    description: 'Sleek glass-top dining table with chrome legs, seats 6 people comfortably',
    category: 'Table',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 8999,
    rentPrice: 799,
    deposit: 1500,
    availability: true,
    sellerId: 'seller3',
    rating: 4.5,
    reviewCount: 15
  },
  {
    id: '5',
    title: 'Luxury King Size Bed',
    description: 'Premium king size bed with upholstered headboard and storage drawers',
    category: 'Bed',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 18999,
    rentPrice: 1499,
    deposit: 3000,
    availability: true,
    sellerId: 'seller2',
    rating: 4.9,
    reviewCount: 28
  },
  {
    id: '6',
    title: 'Vintage Bookshelf',
    description: 'Antique-style wooden bookshelf with 5 shelves and glass doors',
    category: 'Bookshelf',
    images: ['/placeholder.svg'],
    type: 'sell',
    price: 4599,
    availability: true,
    sellerId: 'seller4',
    rating: 4.3,
    reviewCount: 12
  },
  {
    id: '7',
    title: 'Modern Coffee Table',
    description: 'Contemporary coffee table with marble top and gold metal legs',
    category: 'Table',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 6999,
    rentPrice: 599,
    deposit: 1200,
    availability: true,
    sellerId: 'seller1',
    rating: 4.4,
    reviewCount: 19
  },
  {
    id: '8',
    title: 'Comfortable Recliner',
    description: 'Premium leather recliner with massage function and cup holders',
    category: 'Chair',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 12999,
    rentPrice: 999,
    deposit: 2500,
    availability: true,
    sellerId: 'seller3',
    rating: 4.7,
    reviewCount: 21
  },
  {
    id: '9',
    title: 'Storage Ottoman',
    description: 'Multi-functional storage ottoman with hidden compartment and soft cushion',
    category: 'Storage',
    images: ['/placeholder.svg'],
    type: 'sell',
    price: 2999,
    availability: true,
    sellerId: 'seller4',
    rating: 4.2,
    reviewCount: 8
  },
  {
    id: '10',
    title: 'Dining Chair Set',
    description: 'Set of 4 modern dining chairs with comfortable upholstery',
    category: 'Chair',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 3999,
    rentPrice: 399,
    deposit: 800,
    availability: true,
    sellerId: 'seller2',
    rating: 4.6,
    reviewCount: 16
  },
  {
    id: '11',
    title: 'Luxury Wardrobe',
    description: 'Spacious 3-door wardrobe with mirror and multiple compartments',
    category: 'Wardrobe',
    images: ['/placeholder.svg'],
    type: 'both',
    price: 15999,
    rentPrice: 1299,
    deposit: 3200,
    availability: true,
    sellerId: 'seller1',
    rating: 4.8,
    reviewCount: 25
  },
  {
    id: '12',
    title: 'Gaming Desk Setup',
    description: 'Professional gaming desk with RGB lighting and cable management',
    category: 'Desk',
    images: ['/placeholder.svg'],
    type: 'sell',
    price: 7999,
    availability: true,
    sellerId: 'seller3',
    rating: 4.9,
    reviewCount: 35
  }
];

const initialState: AppState = {
  user: null,
  admin: null,
  isAuthenticated: false,
  userType: null,
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
    case 'USER_LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('userType', 'user');
      return {
        ...state,
        user: action.payload,
        admin: null,
        isAuthenticated: true,
        userType: 'user'
      };
    
    case 'ADMIN_LOGIN':
      localStorage.setItem('adminUser', JSON.stringify(action.payload));
      localStorage.setItem('userType', 'admin');
      return {
        ...state,
        user: null,
        admin: action.payload,
        isAuthenticated: true,
        userType: 'admin'
      };
    
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('userType');
      return {
        ...state,
        user: null,
        admin: null,
        isAuthenticated: false,
        userType: null,
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
    const userType = localStorage.getItem('userType');
    if (userType === 'user') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'USER_LOGIN', payload: user });
      }
    } else if (userType === 'admin') {
      const savedAdmin = localStorage.getItem('adminUser');
      if (savedAdmin) {
        const admin = JSON.parse(savedAdmin);
        dispatch({ type: 'ADMIN_LOGIN', payload: admin });
      }
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