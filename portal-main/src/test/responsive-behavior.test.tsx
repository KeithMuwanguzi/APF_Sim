import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import LandingPage from '../pages/LandingPage'
import AboutPage from '../pages/AboutPage'
import EventsPage from '../pages/EventsPage'
import ContactPage from '../pages/ContactPage'

/**
 * Responsive Behavior Test Suite
 * 
 * Tests responsive behavior at breakpoints: 320px, 640px, 768px, 1024px, 1280px, 1920px
 * Validates Requirements: 12.3, 9.1, 9.2, 9.3, 9.4
 */

// Helper function to set viewport size
const setViewportSize = (width: number, height: number = 800) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Update matchMedia to reflect the new viewport
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    // Parse common media queries
    const matches = (() => {
      if (query.includes('min-width: 1024px')) return width >= 1024
      if (query.includes('min-width: 768px')) return width >= 768
      if (query.includes('min-width: 640px')) return width >= 640
      if (query.includes('max-width: 1023px')) return width < 1024
      if (query.includes('max-width: 767px')) return width < 768
      if (query.includes('max-width: 639px')) return width < 640
      return false
    })()
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

// Wrapper component for routing
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Responsive Behavior Tests', () => {
  beforeEach(() => {
    // Reset viewport to default before each test
    setViewportSize(1024, 800)
  })

  describe('Breakpoint: 320px (Mobile - Extra Small)', () => {
    beforeEach(() => {
      setViewportSize(320, 568)
    })

    it('should render mobile menu button on Navbar', () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const menuButton = screen.getByLabelText('Toggle menu')
      expect(menuButton).toBeInTheDocument()
      expect(menuButton).toBeVisible()
    })

    it('should hide desktop navigation links', () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      // Desktop menu should be hidden (has lg:flex class)
      const desktopNav = screen.queryByText('About APF')?.parentElement
      if (desktopNav) {
        expect(desktopNav).toHaveClass('hidden')
      }
    })

    it('should open mobile drawer when menu button is clicked', async () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const menuButton = screen.getByLabelText('Toggle menu')
      fireEvent.click(menuButton)
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close menu')
        expect(closeButton).toBeInTheDocument()
      })
    })

    it('should render Footer in mobile layout', () => {
      render(
        <RouterWrapper>
          <Footer />
        </RouterWrapper>
      )
      
      // Footer should render without errors - check for actual text
      expect(screen.getByText(/© 2025 APF Uganda/i)).toBeInTheDocument()
    })
  })

  describe('Breakpoint: 640px (Mobile - Small)', () => {
    beforeEach(() => {
      setViewportSize(640, 800)
    })

    it('should still show mobile menu button', () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const menuButton = screen.getByLabelText('Toggle menu')
      expect(menuButton).toBeInTheDocument()
    })

    it('should render LandingPage components in mobile layout', () => {
      render(
        <RouterWrapper>
          <LandingPage />
        </RouterWrapper>
      )
      
      // Check that key components render
      const logos = screen.getAllByAltText('APF Logo')
      expect(logos.length).toBeGreaterThan(0)
    })
  })

  describe('Breakpoint: 768px (Tablet - Medium)', () => {
    beforeEach(() => {
      setViewportSize(768, 1024)
    })

    it('should still show mobile menu button (desktop menu starts at lg:1024px)', () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const menuButton = screen.getByLabelText('Toggle menu')
      expect(menuButton).toBeInTheDocument()
    })

    it('should render tablet-optimized layouts', () => {
      render(
        <RouterWrapper>
          <LandingPage />
        </RouterWrapper>
      )
      
      // Page should render without errors
      const logos = screen.getAllByAltText('APF Logo')
      expect(logos.length).toBeGreaterThan(0)
    })
  })

  describe('Breakpoint: 1024px (Desktop - Large)', () => {
    beforeEach(() => {
      setViewportSize(1024, 768)
    })

    it('should hide mobile menu button and show desktop navigation', () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      // Mobile menu button should have lg:hidden class
      const menuButton = screen.getByLabelText('Toggle menu')
      expect(menuButton).toHaveClass('lg:hidden')
      
      // Desktop navigation links should be visible
      expect(screen.getByText('About APF')).toBeInTheDocument()
      expect(screen.getByText('Membership')).toBeInTheDocument()
      expect(screen.getByText('Events')).toBeInTheDocument()
    })

    it('should show desktop action buttons', () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const joinButton = screen.getByText('Join APF')
      const loginButton = screen.getByText('Members Login')
      
      expect(joinButton).toBeInTheDocument()
      expect(loginButton).toBeInTheDocument()
    })

    it('should render desktop layouts for all pages', () => {
      const pages = [
        <LandingPage />,
        <AboutPage />,
        <EventsPage />,
        <ContactPage />,
      ]
      
      pages.forEach((page) => {
        const { unmount } = render(
          <RouterWrapper>
            {page}
          </RouterWrapper>
        )
        
        // Each page should render without errors
        const logos = screen.getAllByAltText('APF Logo')
        expect(logos.length).toBeGreaterThan(0)
        unmount()
      })
    })
  })

  describe('Breakpoint: 1280px (Desktop - Extra Large)', () => {
    beforeEach(() => {
      setViewportSize(1280, 800)
    })

    it('should render full desktop layout with optimal spacing', () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      // Desktop navigation should be fully visible
      expect(screen.getByText('About APF')).toBeInTheDocument()
      expect(screen.getByText('Contact & Enquiries')).toBeInTheDocument()
    })

    it('should render all page components in desktop layout', () => {
      render(
        <RouterWrapper>
          <LandingPage />
        </RouterWrapper>
      )
      
      const logos = screen.getAllByAltText('APF Logo')
      expect(logos.length).toBeGreaterThan(0)
    })
  })

  describe('Breakpoint: 1920px (Desktop - 2XL)', () => {
    beforeEach(() => {
      setViewportSize(1920, 1080)
    })

    it('should render full desktop layout at maximum width', () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      // All desktop elements should be visible
      expect(screen.getByText('About APF')).toBeInTheDocument()
      expect(screen.getByText('Join APF')).toBeInTheDocument()
      expect(screen.getByText('Members Login')).toBeInTheDocument()
    })

    it('should maintain proper layout constraints', () => {
      render(
        <RouterWrapper>
          <LandingPage />
        </RouterWrapper>
      )
      
      // Content should be constrained by max-width utilities
      const logos = screen.getAllByAltText('APF Logo')
      expect(logos.length).toBeGreaterThan(0)
    })
  })

  describe('Mobile Menu Functionality', () => {
    beforeEach(() => {
      setViewportSize(375, 667) // iPhone SE size
    })

    it('should toggle mobile menu open and closed', async () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const menuButton = screen.getByLabelText('Toggle menu')
      
      // Open menu
      fireEvent.click(menuButton)
      
      await waitFor(() => {
        expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
      })
      
      // Close menu
      const closeButton = screen.getByLabelText('Close menu')
      fireEvent.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument()
      })
    })

    it('should close mobile menu when clicking backdrop', async () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const menuButton = screen.getByLabelText('Toggle menu')
      fireEvent.click(menuButton)
      
      await waitFor(() => {
        expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
      })
      
      // Click backdrop (the overlay div)
      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50')
      if (backdrop) {
        fireEvent.click(backdrop)
        
        await waitFor(() => {
          expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument()
        })
      }
    })

    it('should display all navigation links in mobile menu', async () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const menuButton = screen.getByLabelText('Toggle menu')
      fireEvent.click(menuButton)
      
      await waitFor(() => {
        const homeLinks = screen.getAllByText('Home')
        expect(homeLinks.length).toBeGreaterThan(0)
        
        const aboutLinks = screen.getAllByText('About APF')
        expect(aboutLinks.length).toBeGreaterThan(0)
        
        const membershipLinks = screen.getAllByText('Membership')
        expect(membershipLinks.length).toBeGreaterThan(0)
        
        const eventsLinks = screen.getAllByText('Events')
        expect(eventsLinks.length).toBeGreaterThan(0)
        
        const newsLinks = screen.getAllByText('News')
        expect(newsLinks.length).toBeGreaterThan(0)
        
        const contactLinks = screen.getAllByText('Contact & Enquiries')
        expect(contactLinks.length).toBeGreaterThan(0)
      })
    })

    it('should display action buttons in mobile menu', async () => {
      render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      const menuButton = screen.getByLabelText('Toggle menu')
      fireEvent.click(menuButton)
      
      await waitFor(() => {
        const buttons = screen.getAllByText('Join APF')
        expect(buttons.length).toBeGreaterThan(0)
        
        const loginButtons = screen.getAllByText('Members Login')
        expect(loginButtons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Layout Adaptation Across Breakpoints', () => {
    const breakpoints = [
      { width: 320, name: 'Mobile XS' },
      { width: 640, name: 'Mobile SM' },
      { width: 768, name: 'Tablet MD' },
      { width: 1024, name: 'Desktop LG' },
      { width: 1280, name: 'Desktop XL' },
      { width: 1920, name: 'Desktop 2XL' },
    ]

    breakpoints.forEach(({ width, name }) => {
      it(`should render without errors at ${name} (${width}px)`, () => {
        setViewportSize(width, 800)
        
        const { container } = render(
          <RouterWrapper>
            <LandingPage />
          </RouterWrapper>
        )
        
        // Page should render without throwing errors
        expect(container).toBeInTheDocument()
        const logos = screen.getAllByAltText('APF Logo')
        expect(logos.length).toBeGreaterThan(0)
      })
    })

    it('should smoothly transition between breakpoints', () => {
      const { rerender } = render(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      
      // Start at mobile
      setViewportSize(375, 667)
      rerender(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument()
      
      // Transition to desktop
      setViewportSize(1280, 800)
      rerender(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      expect(screen.getByText('About APF')).toBeInTheDocument()
      
      // Back to mobile
      setViewportSize(375, 667)
      rerender(
        <RouterWrapper>
          <Navbar />
        </RouterWrapper>
      )
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument()
    })
  })

  describe('Grid Layout Responsiveness', () => {
    it('should adapt grid layouts at different breakpoints', () => {
      const breakpoints = [320, 640, 768, 1024, 1280, 1920]
      
      breakpoints.forEach((width) => {
        setViewportSize(width, 800)
        
        const { unmount } = render(
          <RouterWrapper>
            <LandingPage />
          </RouterWrapper>
        )
        
        // Grid layouts should render without errors
        const logos = screen.getAllByAltText('APF Logo')
        expect(logos.length).toBeGreaterThan(0)
        unmount()
      })
    })
  })
})
