
import { Link } from 'react-router-dom'
function JoinCTA() {
  return (
    <section className="py-16 px-4 bg-[#F3F4F6]">
      <div className="max-w-3xl mx-auto text-center">
        <h4 className="text-secondary text-[2rem] mb-4 font-bold">
          Join the Future of Accountancy in Uganda
        </h4>
        <p className="text-[#555] mb-2">
          Explore our membership benefits or contact us for more information
        </p>
        <p className="text-[#666] text-sm mb-8">
          Join how to become a part of APF Uganda
        </p>
        <Link to="/membership">
  <button className="bg-[#6A1B9A] text-white px-10 py-4 text-base font-semibold rounded-[25px] shadow-[0_4px_6px_rgba(124,58,237,0.3)] transition-all duration-300 hover:bg-[#4A148C] hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(124,58,237,0.4)]">
    Learn About Membership
  </button>
</Link>
      </div>
    </section>
  )
}

export default JoinCTA
