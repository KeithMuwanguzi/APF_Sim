import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { API_V1_BASE_URL } from '../../config/api'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch(`${API_V1_BASE_URL}/contacts/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Your message has been sent successfully!',
        })
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.',
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      })
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#e5e7eb] py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12">
            {/* Left Column - Contact Info */}
            <div>
              <h5 className="text-xl font-bold mb-4 text-[#1f2937]">
                Get in touch with us
              </h5>
              
              <p className="text-sm text-[#9ca3af] mb-8 leading-[1.7]">
                Have a question about membership, professional development, or upcoming events? Reach out to the Accountancy Practitioners Forum (APF) and our team will be glad to assist. We're here to support members and advance professionalism in accountancy.
              </p>

              <h6 className="text-lg font-bold mb-6 text-[#1f2937]">
                Our Contact Information
              </h6>

              {/* Contact Info */}
              <div className="flex flex-col gap-5">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="text-primary w-[22px] h-[22px] mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937] mb-1">
                      Phone
                    </p>
                    <p className="text-sm text-[#9ca3af]">
                      +256-XXXX-XXXXX
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="text-primary w-[22px] h-[22px] mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937] mb-1">
                      Email
                    </p>
                    <p className="text-sm text-[#9ca3af]">
                      info@apfuganda.com
                    </p>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary w-[22px] h-[22px] mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937] mb-1">
                      Office Address
                    </p>
                    <p className="text-sm text-[#9ca3af]">
                      Spring Road, Bugolobi, Kampala
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <form onSubmit={handleSubmit}>
              {/* Status Message */}
              {submitStatus.type && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              {/* Form Fields Stacked Vertically */}
              <div className="flex flex-col gap-4 mb-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-[#6b7280] font-medium text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-[#6b7280] font-medium text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary transition-colors"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block mb-2 text-[#6b7280] font-medium text-sm">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Inquiry about services"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="mb-6">
                <label className="block mb-2 text-[#6b7280] font-medium text-sm">
                  Your Message
                </label>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-purple-700 text-white py-3 rounded-full text-base font-semibold shadow-[0_2px_8px_rgba(124,58,237,0.3)] transition-all duration-300 hover:bg-purple-800 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(124,58,237,0.5)] ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Submit Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
