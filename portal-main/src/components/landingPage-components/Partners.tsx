import { useEffect } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { CMS_BASE_URL } from '../../config/api';

interface PartnerItem {
  name?: string;
  logo?: any; 
}

function Partners({ data }: { data?: PartnerItem[] }) {
  const { elementRef, isVisible } = useScrollAnimation()

  const defaultPartners = [
    { name: 'ICPAU', logo: '/ICPAU.jfif' },
    { name: 'ACCA', logo: '/ACCA.jfif' },
    { name: 'UBA', logo: '/uba.png' },
  ]

  const items = Array.isArray(data) && data.length > 0 ? data : defaultPartners;

  const getLogoUrl = (item: any) => {
    if (!item) return '';
    
    
    if (typeof item.logo === 'string') return item.logo;

    
    const logoData = item.logo?.data?.attributes || item.logo?.attributes || item.logo;
    const path = logoData?.url || '';

    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${CMS_BASE_URL}${path}`;
    
    return path;
  };

  return (
    <section className="bg-white py-12 sm:py-16 px-4 overflow-hidden min-h-[200px]">
      <h4 ref={elementRef} className={`text-center text-secondary text-[1.75rem] sm:text-[2rem] mb-8 sm:mb-12 font-bold transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        Our Partners
      </h4>

      <div className="max-w-full overflow-hidden relative py-6 sm:py-8">
        <div className="flex gap-12 sm:gap-24 w-max animate-scroll items-center">
          {[...items, ...items].map((partner, index) => {
            const logoPath = getLogoUrl(partner);
            if (!logoPath) return null;

            return (
              <div key={index} className="flex-shrink-0 px-4">
                <img
                  src={logoPath}
                  alt={partner.name || 'Partner Logo'}
                  className="h-16 sm:h-24 w-auto object-contain block"
                  style={{ minWidth: '140px' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 40s linear infinite; }
        .animate-scroll:hover { animation-play-state: paused; }
      `}</style>
    </section>
  )
}

export default Partners
