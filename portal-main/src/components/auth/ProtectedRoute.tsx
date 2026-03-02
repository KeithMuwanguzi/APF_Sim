import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // For now, check a fake token in localStorage
  const isAuthenticated = localStorage.getItem('token')

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute