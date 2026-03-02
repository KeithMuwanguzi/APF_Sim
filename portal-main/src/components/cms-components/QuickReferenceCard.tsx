import { useState } from 'react';
import { BookOpen, X, ExternalLink, CheckCircle } from 'lucide-react';

export const QuickReferenceCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#5C32A3] hover:bg-[#4a2885] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center gap-2"
      >
        <BookOpen size={24} />
        <span className="font-bold text-sm">Quick Guide</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5C32A3] to-[#7E49B3] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <BookOpen size={20} />
          <h3 className="font-bold">CMS Quick Reference</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {/* Getting Started */}
          <section>
            <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Getting Started
            </h4>
            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-2">
              <div>
                <p className="font-semibold text-slate-700">1. Start Strapi</p>
                <code className="block bg-slate-800 text-white p-2 rounded mt-1 font-mono">
                  cd CMS && yarn develop
                </code>
              </div>
              <div>
                <p className="font-semibold text-slate-700">2. Access Admin</p>
                <a
                  href="http://localhost:1337/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5C32A3] hover:underline flex items-center gap-1"
                >
                  http://localhost:1337/admin <ExternalLink size={12} />
                </a>
              </div>
              <div>
                <p className="font-semibold text-slate-700">3. Enable Permissions</p>
                <p className="text-slate-600 mt-1">
                  Settings → Roles → Public → Enable find & findOne
                </p>
              </div>
            </div>
          </section>

          {/* Content Types */}
          <section>
            <h4 className="font-bold text-sm text-slate-800 mb-2">Content Types</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-50 p-2 rounded-lg">
                <p className="font-semibold text-purple-900">Collection Types</p>
                <ul className="mt-1 space-y-0.5 text-purple-700">
                  <li>• Events - Conferences, workshops, seminars</li>
                  <li>• News Articles - Press releases, updates</li>
                  <li>• Leadership - Team members</li>
                  <li>• Benefits - Membership perks</li>
                  <li>• FAQs - Common questions</li>
                  <li>• Partners - Organization partners</li>
                  <li>• Timeline - Historical events</li>
                </ul>
              </div>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <p className="font-semibold text-indigo-900">Single Types</p>
                <ul className="mt-1 space-y-0.5 text-indigo-700">
                  <li>• Homepage - Landing page content</li>
                  <li>• About Page - Organization info</li>
                  <li>• Membership Page - Join process</li>
                  <li>• Contact Info - Contact details</li>
                  <li>• Site Settings - Global config</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Quick Tips */}
          <section>
            <h4 className="font-bold text-sm text-slate-800 mb-2">Quick Tips</h4>
            <div className="bg-amber-50 rounded-lg p-3 text-xs space-y-2 text-amber-900">
              <p>💡 Always click <strong>Publish</strong> after creating content</p>
              <p>💡 Use <strong>Featured</strong> flags for important items</p>
              <p>💡 Set <strong>Order</strong> field to control display sequence</p>
              <p>💡 Optimize images before uploading</p>
              <p>💡 Use descriptive slugs for SEO</p>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h4 className="font-bold text-sm text-slate-800 mb-2">Troubleshooting</h4>
            <div className="bg-rose-50 rounded-lg p-3 text-xs space-y-2 text-rose-900">
              <p><strong>Connection Error?</strong></p>
              <p>→ Check if Strapi is running</p>
              <p>→ Verify API permissions are enabled</p>
              <p className="mt-2"><strong>No Data?</strong></p>
              <p>→ Create and publish content in Strapi</p>
              <p>→ Click Refresh button</p>
            </div>
          </section>

          {/* Documentation Link */}
          <section>
            <a
              href="/CMS_INTEGRATION_GUIDE.md"
              target="_blank"
              className="block bg-gradient-to-r from-[#5C32A3] to-[#7E49B3] text-white p-3 rounded-lg text-center font-bold text-sm hover:shadow-lg transition-all"
            >
              View Full Documentation →
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};
