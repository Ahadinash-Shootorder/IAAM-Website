'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BecomeMemberForm from '@/components/Membership/BecomeMemberForm';
import LazyImage from '@/components/common/LazyImage';
import { MoreVertical } from 'lucide-react';

type MobileAuthProps = {
  onCloseDrawer?: () => void;
};

function getProfileImageUrl(profileImage: {
  id?: number;
  name?: string;
  url?: string;
  formats?: {
    thumbnail?: {
      url?: string;
    };
  };
} | string | null | undefined): string | null {
  if (!profileImage) return null;

  // If it's a string, treat it as the URL directly
  if (typeof profileImage === 'string') {
    return profileImage.startsWith('http') ? profileImage : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.iaamonline.org'}${profileImage}`;
  }

  // If it's an object, extract the URL
  const url =
    profileImage?.formats?.thumbnail?.url ||
    profileImage?.url ||
    null;

  if (!url) return null;
  return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.iaamonline.org'}${url}`;
}

export default function MobileAuth({ onCloseDrawer }: MobileAuthProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenProfile = () => {
    setProfileDropdownOpen(false);
    setAuthModalOpen(false);
    onCloseDrawer?.();
    router.push('/profile');
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setAuthModalOpen(false);
    onCloseDrawer?.();
    logout();
    router.push('/');
  };

  const displayName = user?.FirstName
    ? `${user.FirstName}${user.LastName ? ' ' + user.LastName : ''}`.trim()
    : user?.username || '';

  const initials = user
    ? user.FirstName && user.LastName
      ? (user.FirstName[0] + user.LastName[0]).toUpperCase()
      : (user.FirstName?.[0] || user.username?.[0] || 'U').toUpperCase()
    : '';

  const profileImageUrl = getProfileImageUrl(user?.ProfileImage);

  if (user) {
    // Logged in user - show profile info and logout
    return (
      <>
        <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-200 text-[#1e40af] flex items-center justify-center text-sm font-black flex-shrink-0 border-2 border-white/30">
                {profileImageUrl ? (
                  <LazyImage
                    src={profileImageUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{displayName}</p>
                <p className="text-xs text-blue-200 truncate">{user.email}</p>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Profile options"
            >
              <MoreVertical size={20} className="text-white" />
            </button>
          </div>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 mt-1">
              <button
                type="button"
                onClick={handleOpenProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-[#1e40af] transition"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">My Profile</span>
              </button>

              <div className="border-t border-gray-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Auth Modal */}
        {authModalOpen && (
          <BecomeMemberForm
            mode={authModalMode}
            onModeChange={setAuthModalMode}
            onClose={() => setAuthModalOpen(false)}
          />
        )}
      </>
    );
  }

  // Not logged in - show login/signup buttons
  return (
    <>
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Welcome to IAAM</h3>
          <p className="text-sm text-gray-600">Join our community of innovators</p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="w-full py-3 px-4 bg-[#1e40af] text-white font-semibold rounded-lg hover:bg-[#1c3e9c] transition duration-200"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className="w-full py-3 px-4 border-2 border-[#1e40af] text-[#1e40af] font-semibold rounded-lg hover:bg-[#1e40af] hover:text-white transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      {authModalOpen && (
        <BecomeMemberForm
          mode={authModalMode}
          onModeChange={setAuthModalMode}
          onClose={() => setAuthModalOpen(false)}
        />
      )}
    </>
  );
}
