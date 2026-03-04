import { useNavigate } from 'react-router-dom';
import defaultHeroImg from '../../assets/images/landingPage-image/land.jpg';
import { CMS_BASE_URL } from '../../config/api';

function Hero({ data }: { data?: any }) {
  const navigate = useNavigate();

 
  const bgUrl = data?.backgroundImage?.url 
    ? `${CMS_BASE_URL}${data.backgroundImage.url}` 
    : defaultHeroImg;

  return (
    <section 
      className="min-h-[500px] flex items-center relative overflow-hidden pt-16 -mt-16 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20" />
      <div className="max-w-6xl mx-auto w-full px-4 relative z-10 text-white">
        <div className="max-w-3xl animate-fade-in-up">
          <h1 className="text-4xl lg:text-[3.5rem] mb-6 font-bold leading-tight">
            {data?.title || "Advancing Accountancy Excellence in Uganda"}
          </h1>
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            {data?.subtitle || "The leading voice for ethical practice and professional development in the Ugandan accountancy sector."}
          </p>
          <button onClick={() => navigate('/register')} className="border-2 border-white px-10 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition-all">
            Become a Member
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
