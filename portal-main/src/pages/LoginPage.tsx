import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

import apfLogo from '../assets/whitelogo.png'
import loginImage from '../assets/images/Login-image/login.jpg'

import { API_V1_BASE_URL } from '../config/api'
import { saveAuth } from '../utils/authStorage'

function LoginPage() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_V1_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Check if OTP was bypassed (test users)
        if (data.otp_bypassed) {
          // Direct login - store tokens using authStorage
          saveAuth(data.access, data.refresh, data.user)
          
          console.log('✅ Login successful (OTP bypassed for test user)')
          console.log('User role:', data.user.role)
          console.log('Auth saved to sessionStorage')
          
          // Navigate to appropriate dashboard based on role
          const dashboardRoute = (data.user.role === "1" || data.user.role === 1) 
            ? '/admin/dashboard' 
            : '/dashboard'
          
          console.log('Navigating to:', dashboardRoute)
          navigate(dashboardRoute)
          return
        }

        // Regular flow - store session info for OTP verification
        sessionStorage.setItem('otp_session_id', data.session_id)
        sessionStorage.setItem('remember_me', rememberMe.toString())
        sessionStorage.setItem('login_email', email)

        // OTP email is sent by backend automatically
        console.log('OTP email sent by backend to:', data.email)

        // Navigate to OTP page
        navigate('/otp')
      } else {
        // Show error message
        setError(data.error?.message || 'Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Unable to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center
      bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6))]"
      style={{ backgroundImage: `url(${loginImage})` }}
      >

      <div className="w-[90%] max-w-5xl grid grid-cols-1 md:grid-cols-2        
        bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">  
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center px-10 py-16 text-white text-center md:text-left">
          <Link to="/" className="w-56 mx-auto md:mx-0 cursor-pointer">
            <img src={apfLogo} alt="APF Logo" className="w-56" />
          </Link>
          <h1 className="mt-8 text-3xl md:text-4xl font-semibold leading-tight">
            Your Professional Journey Begins Here
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white px-10 py-14 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-900"> Login</h2>
          <span className="text-gray-500 mt-1 mb-8">
            Sign in to access your APF portal
          </span>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-2 w-full rounded-lg border-2 border-gray-200 px-4 py-3
                  focus:outline-none focus:border-purple-600
                  focus:ring-4 focus:ring-purple-200
                  disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 pr-12
                    focus:outline-none focus:border-purple-600
                    focus:ring-4 focus:ring-purple-200
                    disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600
                    disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs text-gray-600">

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="accent-purple-600 disabled:cursor-not-allowed"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-purple-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 py-3 text-white font-semibold
                hover:bg-purple-700 transition-
                disabled:bg-purple-400 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign up */}
            <div className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-purple-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
