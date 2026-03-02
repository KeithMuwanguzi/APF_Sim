import { FC } from "react";
import { useProfile } from "../../hooks/useProfile";

type HeaderProps = {
  title: string;
};

const Header: FC <HeaderProps> = ({
title
}) => {
  const { profile, loading } = useProfile();

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3 h-20 rounded-md">
      {/* Left: Page Title */}
      <h2 className="text-lg font-semibold text-gray-700 pl-4">
      {title}
      </h2>

       

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Search */} 
       
        
        {/* Profile */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {profile?.profile_picture_url ? (
                <img 
                  src={profile.profile_picture_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-[#5F2F8B] flex items-center justify-center text-white font-bold text-sm">
                  {profile?.initials || 'U'}
                </div>
              )}
            </div>
          )}
          <div className="text-sm">
            {loading ? (
              <>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-700">
                  {profile?.full_name || profile?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {profile?.user_role === '1' ? 'Administrator' : 'Member'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



export default Header;