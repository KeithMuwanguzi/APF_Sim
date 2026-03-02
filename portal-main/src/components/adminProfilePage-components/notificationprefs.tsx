

import { ActionButton } from './ui'; 

interface ToggleProps {
  label: string;
  sub: string;
  active?: boolean;
}

const Toggle = ({ label, sub, active }: ToggleProps) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${active ? 'bg-[#5C32A3]' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`}></div>
    </div>
  </div>
);

export const NotificationPrefs = () => {
  const categories = [
    'Membership Updates', 
    'Payment Reminders', 
    'Announcements', 
    'System Messages', 
    'Event Invitations', 
    'Training Opportunities'
  ];

  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6">
      <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Notification Preferences</h2>
        <p className="text-sm text-gray-400">Choose how and when you receive updates.</p>
      </div>

      <div className="space-y-2 mb-8">
        <Toggle 
          label="Email Notifications" 
          sub="Receive important updates and announcements via email." 
          active 
        />
        <Toggle 
          label="SMS Notifications" 
          sub="Get critical alerts and reminders directly to your mobile." 
        />
        <Toggle 
          label="In-App Notifications" 
          sub="View notifications directly within the portal." 
          active 
        />
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <p className="text-xs font-bold text-[#5C32A3] mb-4 flex items-center gap-2 uppercase tracking-wider">
          Notification Categories
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 accent-[#5C32A3]" 
                defaultChecked={cat !== 'Announcements'} 
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <ActionButton text="Update Preferences" />
      </div>
    </section>
  );
};