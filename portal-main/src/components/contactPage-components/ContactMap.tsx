function ContactMap() {
  // Kampala coordinates: 0.328568, 32.590748
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7571234567!2d32.590748!3d0.328568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMTknNDIuOCJOIDMywrAzNScyNi43IkU!5e0!3m2!1sen!2sug!4v1234567890123!5m2!1sen!2sug`

  return (
    <div className="py-0">
      <div className="w-full h-[300px] md:h-[450px] relative overflow-hidden">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="APF Uganda Office Location - Kampala"
        />
      </div>
    </div>
  )
}

export default ContactMap
