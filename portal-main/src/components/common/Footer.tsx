import logoBlue from '../../assets/logo_blue.png'
import { Link } from 'react-router-dom'

//  SVG Components ---
const FacebookLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const LinkedinLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const YoutubeLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const XLogo = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1fr] gap-12 lg:gap-24 mb-16">
          
          {/* Brand Section */}
          <div className="flex flex-col items-start">
            <img src={logoBlue} alt="APF Logo" className="h-16 mb-6 object-contain" />
            <p className="text-gray-500 leading-relaxed mb-8 max-w-sm text-[0.95rem]">
              The Accountancy Practitioners Forum (APF Uganda) is dedicated to fostering excellence and promoting the highest standards in the accountancy profession in Uganda.
            </p>
            
            {/*  Social Icons Row */}
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a href="#" target="_blank" rel="noreferrer" className="text-[#1877F2] w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform">
                <FacebookLogo size={22} />
              </a>
              
              {/* X  */}
              <a href="#" target="_blank" rel="noreferrer" className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                <XLogo size={14} />
              </a>
              
              {/* LinkedIn */}
              <a href="#" target="_blank" rel="noreferrer" className="text-[#0A66C2] w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform">
                <LinkedinLogo size={22} />
              </a>
              
              {/* YouTube */}
              <a href="#" target="_blank" rel="noreferrer" className="text-[#FF0000] w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform">
                <YoutubeLogo size={24} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h6 className="text-[#1e293b] mb-6 text-lg font-bold">Quick Links</h6>
            <ul className="space-y-4">
              {['Membership', 'Governance', 'Policy Documents', 'Annual Reports', 'FAQs'].map((link) => (
                <li key={link}>
                  <Link to="#" className="text-gray-500 hover:text-[#5E2590] transition-colors text-[0.95rem] font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Connect Section */}
          <div>
            <h6 className="text-[#1e293b] mb-6 text-lg font-bold">Connect</h6>
            <ul className="space-y-4">
              {['Member Directory', 'Partners', 'Sponsorship'].map((link) => (
                <li key={link}>
                  <Link to="#" className="text-gray-500 hover:text-[#5E2590] transition-colors text-[0.95rem] font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="w-full h-px bg-gray-100 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-[0.85rem]">
          <p>© {new Date().getFullYear()} APF Uganda. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E2590]"></span>
            1234 APF Street, Kampala, Uganda
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;