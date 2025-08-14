export interface User {
  id: string
  email: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  isSubmitting: boolean
}
