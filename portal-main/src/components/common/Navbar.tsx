import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoPurple from '../../assets/logo_purple.png'
import whitelogo from '../../assets/whitelogo.png'
import { isAuthenticated, getUser } from '../../utils/authStorage'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Check if user is logged in
  const loggedIn = isAuthenticated()
  const user = getUser()
  const userRole = user && (user.role === '1' || user.role === 1) ? 'admin' : 'member'
  const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/dashboard'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsScrolled(false)
    setIsMenuOpen(false)
  }, [location.pathname])

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About APF' },
    { path: '/membership', label: 'Membership' },
    { path: '/events', label: 'Events' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact & Enquiries' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20'
          : 'bg-white/15 backdrop-blur-md'
      }`}
    >
      {/* NAVBAR */}
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 min-h-[64px] flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={isScrolled ? logoPurple : whitelogo}
            alt="APF Logo"
            className="h-[38px] sm:h-[42px] md:h-[48px] transition-opacity duration-300"
          />
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[0.9rem] font-medium transition-colors ${
                isActive(link.path)
                  ? isScrolled
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-white border-b-2 border-white'
                  : isScrolled
                  ? 'text-secondary hover:text-primary'
                  : 'text-white hover:text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden lg:flex gap-4">
          <Link to="/register">
            <button
              className={`rounded-full px-6 py-2 font-medium transition-all ${
                isScrolled
                  ? 'border-2 border-secondary text-secondary hover:bg-[#5F1C9F] hover:text-white'
                  : 'border-2 border-white text-white hover:bg-[#5F1C9F]'
              }`}
            >
              Join APF
            </button>
          </Link>

          {loggedIn ? (
            <Link to={dashboardPath}>
              <button className="bg-[#5F1C9F] rounded-full px-6 py-2 font-medium text-white shadow hover:-translate-y-0.5 transition-all">
                My Dashboard
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="bg-[#5F1C9F] rounded-full px-6 py-2 font-medium text-white shadow hover:-translate-y-0.5 transition-all">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className={`lg:hidden p-2 rounded-lg ${
            isScrolled
              ? 'text-secondary hover:bg-black/5'
              : 'text-white hover:bg-white/10'
          }`}
          onClick={toggleMenu}
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* MOBILE DRAWER  */}
      {isMenuOpen && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={toggleMenu}
          />

          {/* SIDEBAR */}
          <aside className="fixed top-0 right-0 h-screen w-[320px] bg-white z-[70] shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="flex items-center justify-between p-5">
              <button onClick={toggleMenu}>
                <X className="w-6 h-6 text-secondary" />
              </button>
            </div>

            {/* CONTENT*/}
            <div className="flex-1 px-4 space-y-2 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-secondary hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* ACTION BUTTONS */}
              <div className="pt-6 flex flex-col gap-5">
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full border-2 border-secondary text-secondary rounded-full py-3 font-medium hover:bg-[#5F1C9F] hover:text-white transition">
                    Join APF
                  </button>
                </Link>

                {loggedIn ? (
                  <Link to={dashboardPath} onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-[#5F1C9F] text-white rounded-full py-3 font-medium shadow transition hover:-translate-y-0.5">
                      My Dashboard
                    </button>
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-[#5F1C9F] text-white rounded-full py-3 font-medium shadow transition hover:-translate-y-0.5">
                      Members Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  )
}

export default Navbar
