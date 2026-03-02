/**
 * Intro component for the membership page.
 * Displays an introductory section about joining APF Uganda.
 */
function Intro() {
  return (
    <section className="bg-[#f3f4f6] py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-[900px] mx-auto text-center">
        <p className="
          text-sm
          sm:text-base
          text-black
          leading-relaxed
          sm:leading-[2.4]
          max-w-[1050px]
          mx-auto
        ">
          By joining APF Uganda, you will be part of a professional community
          that connects accounting practitioners, supports their growth, and
          represents their interests across Uganda.
        </p>
      </div>
    </section>
  )
}

export default Intro
