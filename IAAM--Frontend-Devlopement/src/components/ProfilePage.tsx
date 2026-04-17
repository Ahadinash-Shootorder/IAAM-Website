'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LazyImage from '@/components/common/LazyImage';

interface ProfileFormData {
  FirstName: string;
  LastName: string;
  Phone: string;
  Biography: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const STRAPI_URL = 'https://admin.iaamonline.org';

/* ─────────────────────────── helpers ─────────────────────────── */
function getBiographyText(bio: any[]): string {
  if (!Array.isArray(bio)) return '';
  return bio
    .map((block: any) =>
      block?.children?.map((c: any) => c?.text || '').join('') || ''
    )
    .join('\n');
}

function getInitials(user: {
  FirstName?: string;
  LastName?: string;
  username?: string;
}): string {
  if (user.FirstName && user.LastName)
    return (user.FirstName[0] + user.LastName[0]).toUpperCase();
  if (user.FirstName) return user.FirstName[0].toUpperCase();
  return (user.username?.[0] || 'U').toUpperCase();
}

function getImageUrl(profileImage: any): string | null {
  if (!profileImage) return null;
  const url = profileImage?.url || profileImage?.formats?.thumbnail?.url || null;
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

/* ─────────────────────────── shared UI ─────────────────────────── */
function Card({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className="bg-white rounded-2xl border border-blue-100/60 overflow-hidden transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-blue-50">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1e40af] flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function ReadField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-gray-800 bg-slate-50 rounded-xl px-3 py-2.5">
        {value || <span className="text-gray-300 italic">Not set</span>}
      </p>
    </div>
  );
}

function MsgBox({ msg }: { msg: { type: 'success' | 'error'; text: string } | null }) {
  if (!msg) return null;
  return (
    <div className={`text-sm px-4 py-3 rounded-xl flex items-start gap-2 ${
      msg.type === 'success'
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
        : 'bg-red-50 text-red-700 border border-red-100'
    }`}>
      <span className="mt-0.5 flex-shrink-0">{msg.type === 'success' ? '✓' : '✕'}</span>
      {msg.text}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   PROFILE IMAGE MODAL
════════════════════════════════════════════════════════ */
function ProfileImageModal({
  user,
  jwt,
  onUpdate,
  onClose,
}: {
  user: any;
  jwt: string;
  onUpdate: (profileImage: any) => void;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageMsg, setImageMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const currentImageUrl = getImageUrl(user?.ProfileImage);
  const displayImage = previewUrl || currentImageUrl;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageMsg({ type: 'error', text: 'Please select a valid image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageMsg({ type: 'error', text: 'Image must be smaller than 5MB.' });
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    setImageMsg(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson?.error?.message || 'Upload failed.');
      const uploadedFile = Array.isArray(uploadJson) ? uploadJson[0] : uploadJson;
      const updateRes = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ ProfileImage: uploadedFile.id }),
      });
      const updateJson = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateJson?.error?.message || 'Failed to link image.');
      onUpdate(uploadedFile);
      setImageMsg({ type: 'success', text: 'Profile photo updated!' });
    } catch (err: any) {
      setImageMsg({ type: 'error', text: err.message });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDeleteImage = async () => {
    if (!user?.ProfileImage?.id) return;
    setDeleting(true);
    setImageMsg(null);
    try {
      const updateRes = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ ProfileImage: null }),
      });
      if (!updateRes.ok) {
        const j = await updateRes.json();
        throw new Error(j?.error?.message || 'Failed to remove image.');
      }
      await fetch(`${STRAPI_URL}/api/upload/files/${user.ProfileImage.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwt}` },
      });
      onUpdate(null);
      setPreviewUrl(null);
      setImageMsg({ type: 'success', text: 'Profile photo removed.' });
    } catch (err: any) {
      setImageMsg({ type: 'error', text: err.message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.92) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Profile Photo</h3>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, GIF · Max 5MB</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-blue-50 shadow-lg bg-gradient-to-br from-[#1e40af] to-[#2563eb] flex items-center justify-center">
              {displayImage ? (
                <LazyImage src={displayImage} alt="Profile" fill className="object-cover" />
              ) : (
                <span className="text-white text-3xl font-black">{getInitials(user)}</span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
              dragOver ? 'border-[#1e40af] bg-blue-50' : 'border-gray-200 hover:border-[#1e40af]/50 hover:bg-blue-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-[#1e40af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">{uploading ? 'Uploading…' : 'Click or drag & drop'}</p>
            <p className="text-xs text-gray-400 mt-0.5">to upload a new photo</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {imageMsg && <MsgBox msg={imageMsg} />}

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || deleting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#1e40af] text-white rounded-xl text-xs font-bold hover:bg-[#1c3e9c] transition disabled:opacity-50 shadow-md shadow-blue-100"
            >
              {uploading ? <><Spinner /> Uploading…</> : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {displayImage ? 'Change Photo' : 'Upload Photo'}
                </>
              )}
            </button>
            {displayImage && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={uploading || deleting}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition disabled:opacity-50"
              >
                {deleting ? <Spinner /> : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                {deleting ? 'Removing…' : 'Remove'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PHOTO ROW — inline inside profile card
════════════════════════════════════════════════════════ */
function PhotoRow({
  user,
  onOpen,
}: {
  user: any;
  onOpen: () => void;
}) {
  const imageUrl = getImageUrl(user?.ProfileImage);
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
      {/* Avatar button */}
      <button
        type="button"
        onClick={onOpen}
        className="relative group flex-shrink-0 focus:outline-none"
        title="Change profile photo"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow bg-gradient-to-br from-[#1e40af] to-[#2563eb] flex items-center justify-center">
          {imageUrl ? (
            <LazyImage src={imageUrl} alt="Profile" fill className="object-cover" />
          ) : (
            <span className="text-white text-lg font-black">{getInitials(user)}</span>
          )}
        </div>
        {/* Camera overlay on hover */}
        <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </button>

      {/* Text — takes remaining space, min-w-0 prevents overflow */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate leading-tight">
          {(user.FirstName || user.LastName)
            ? `${user.FirstName || ''} ${user.LastName || ''}`.trim()
            : user.username}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
          {imageUrl ? 'Profile photo set' : 'No profile photo yet'}
        </p>
      </div>

      {/* CTA button — flex-shrink-0 so it never squishes */}
      <button
        type="button"
        onClick={onOpen}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 border border-[#1e40af]/25 bg-white text-[#1e40af] rounded-xl text-xs font-bold hover:bg-blue-50 hover:border-[#1e40af]/50 transition shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {imageUrl ? 'Change' : 'Upload'}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, jwt, logout, updateUser } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const { register, handleSubmit, formState: { errors }, reset: resetProfile } = useForm<ProfileFormData>({
    defaultValues: {
      FirstName: user?.FirstName || '',
      LastName: user?.LastName || '',
      Phone: user?.Phone || '',
      Biography: getBiographyText(user?.Biography || []),
    },
  });

  const { register: regPwd, handleSubmit: handlePwdSubmit, formState: { errors: pwdErrors }, watch, reset: resetPassword } = useForm<PasswordFormData>();
  const newPwdValue = watch('newPassword');

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#1e40af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">Not Signed In</h2>
          <p className="text-gray-500 text-sm mt-1">Please sign in to access your IAAM profile.</p>
        </div>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-[#1e40af] text-white rounded-full text-sm font-bold hover:bg-[#1c3e9c] transition shadow-lg shadow-blue-200">
          Back to Home
        </button>
      </div>
    );
  }

  const handleProfileSave = async (data: ProfileFormData) => {
    if (!user || !jwt) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          FirstName: data.FirstName,
          LastName: data.LastName,
          Phone: data.Phone,
          Biography: [{ type: 'paragraph', children: [{ type: 'text', text: data.Biography }] }],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'Failed to update profile.');
      updateUser({ FirstName: data.FirstName, LastName: data.LastName, Phone: data.Phone, Biography: json.Biography });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditingProfile(false);
    } catch (e: any) {
      setProfileMsg({ type: 'error', text: e.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (data: PasswordFormData) => {
    if (!jwt) return;
    setPasswordSaving(true);
    setPasswordMsg(null);
    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          password: data.newPassword,
          passwordConfirmation: data.confirmPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'Failed to change password.');
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setIsChangingPassword(false);
      resetPassword();
    } catch (e: any) {
      setPasswordMsg({ type: 'error', text: e.message });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileMsg(null);
    resetProfile({
      FirstName: user?.FirstName || '',
      LastName: user?.LastName || '',
      Phone: user?.Phone || '',
      Biography: getBiographyText(user?.Biography || []),
    });
  };

  /* shared style strings */
  const inputClass = 'w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] transition placeholder:text-gray-300';
  const labelClass = 'block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5';
  const errorClass = 'text-red-500 text-xs mt-1 flex items-center gap-1';

  const tabs = [
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'security' as const,
      label: 'Security',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  const displayName = user.FirstName || user.LastName
    ? `${user.FirstName || ''} ${user.LastName || ''}`.trim()
    : user.username;

  const currentImageUrl = getImageUrl(user?.ProfileImage);

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      {/* Modal */}
      {showImageModal && (
        <ProfileImageModal
          user={user}
          jwt={jwt!}
          onUpdate={(profileImage) => updateUser({ ProfileImage: profileImage })}
          onClose={() => setShowImageModal(false)}
        />
      )}

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ══════════════════════════════════════
              LEFT — Sticky Sidebar (desktop only)
          ══════════════════════════════════════ */}
          <div
            className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-8 transition-all duration-700"
            style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-20px)' }}
          >
            <div className="bg-white rounded-3xl border border-blue-100 overflow-hidden">
              <div className="px-5 py-6 sm:px-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="relative group focus:outline-none"
                    title="Change profile photo"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-[#1e40af] to-[#2563eb] flex items-center justify-center">
                      {currentImageUrl ? (
                        <LazyImage src={currentImageUrl} alt="Profile" fill className="object-cover" />
                      ) : (
                        <span className="text-white text-2xl font-black">{getInitials(user)}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-[#1e40af] border-2 border-white flex items-center justify-center shadow group-hover:bg-[#1c3e9c] transition">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </button>
                  <div className="mt-3 text-center">
                    <h1 className="text-lg font-black text-gray-900 leading-tight">{displayName}</h1>
                    <p className="text-xs text-gray-400 mt-0.5">@{user.username}</p>
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-blue-100" />

                {/* Info rows */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#1e40af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.Phone && (
                    <div className="flex items-center gap-2.5 text-xs text-gray-500">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-[#1e40af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span>{user.Phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#1e40af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <span>ID: #{user.id}</span>
                  </div>
                </div>

                {getBiographyText(user.Biography || []) && (
                  <>
                    <div className="my-4 border-t border-dashed border-blue-100" />
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-4 italic">
                      "{getBiographyText(user.Biography || [])}"
                    </p>
                  </>
                )}

                <div className="my-4 border-t border-dashed border-blue-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 rounded-xl transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════
              RIGHT — Tab content
          ══════════════════════════════════════ */}
          <div
            className="flex-1 min-w-0 w-full transition-all duration-700"
            style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(20px)' }}
          >
            {/* Tab nav */}
            <div className="flex gap-1 mb-4 bg-white rounded-2xl p-1.5 border border-blue-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeTab === tab.id ? 'bg-[#1e40af] text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ══════════ PROFILE TAB ══════════ */}
            {activeTab === 'profile' && (
              <Card delay={100}>
                <SectionHeader
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  title="Profile Information"
                  subtitle="Manage your personal details visible to IAAM"
                />

                {/* ── Card body: consistent padding across all states ── */}
                <div className="px-4 sm:px-6 py-5 space-y-5">

                  {/* Photo row — always visible, above fields */}
                  <PhotoRow user={user} onOpen={() => setShowImageModal(true)} />

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-100" />

                  {!isEditingProfile ? (
                    /* ── READ MODE ── */
                    <>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <ReadField label="First Name" value={user.FirstName} />
                        <ReadField label="Last Name" value={user.LastName} />
                      </div>
                      <ReadField label="Phone Number" value={user.Phone} />
                      <div>
                        <p className={labelClass}>Biography</p>
                        <p className="text-sm text-gray-700 bg-slate-50 rounded-xl px-3 py-3 min-h-[80px] leading-relaxed whitespace-pre-wrap">
                          {getBiographyText(user.Biography || []) || <span className="text-gray-300 italic">Not set</span>}
                        </p>
                      </div>

                      <MsgBox msg={profileMsg} />

                      <button
                        type="button"
                        onClick={() => { setIsEditingProfile(true); setProfileMsg(null); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1e40af] text-white rounded-xl text-sm font-bold hover:bg-[#1c3e9c] transition shadow-md shadow-blue-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                      </button>
                    </>
                  ) : (
                    /* ── EDIT MODE ── */
                    <form onSubmit={handleSubmit(handleProfileSave)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className={labelClass}>First Name</label>
                          <input {...register('FirstName')} type="text" className={inputClass} placeholder="John" />
                        </div>
                        <div>
                          <label className={labelClass}>Last Name</label>
                          <input {...register('LastName')} type="text" className={inputClass} placeholder="Doe" />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Phone Number</label>
                        <input {...register('Phone')} type="tel" className={inputClass} placeholder="+1 (555) 123-4567" />
                      </div>

                      <div>
                        <label className={labelClass}>Biography</label>
                        <textarea
                          {...register('Biography', { minLength: { value: 10, message: 'At least 10 characters' } })}
                          rows={5}
                          className={`${inputClass} resize-none`}
                          placeholder="Tell us about yourself, your research, and interests…"
                        />
                        {errors.Biography && <p className={errorClass}>⚠ {errors.Biography.message}</p>}
                      </div>

                      <MsgBox msg={profileMsg} />

                      <div className="flex gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={profileSaving}
                          className="flex-1 py-2.5 bg-[#1e40af] text-white rounded-xl text-sm font-bold hover:bg-[#1c3e9c] transition disabled:opacity-50 shadow-md shadow-blue-100"
                        >
                          {profileSaving ? (
                            <span className="flex items-center justify-center gap-2"><Spinner /> Saving…</span>
                          ) : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </Card>
            )}

            {/* ══════════ SECURITY TAB ══════════ */}
            {activeTab === 'security' && (
              <Card delay={100}>
                <SectionHeader
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  title="Password & Security"
                  subtitle="Keep your IAAM account secure"
                />

                <div className="px-4 sm:px-6 py-5">
                  {!isChangingPassword ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 sm:gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Account is Secured</p>
                          <p className="text-xs text-gray-500 mt-0.5">Your password is set. Change it periodically.</p>
                        </div>
                      </div>
                      <MsgBox msg={passwordMsg} />
                      <button
                        type="button"
                        onClick={() => { setIsChangingPassword(true); setPasswordMsg(null); }}
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#1e40af] text-[#1e40af] rounded-xl text-sm font-bold hover:bg-blue-50 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Change Password
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePwdSubmit(handlePasswordSave)} className="space-y-4">
                      <div>
                        <label className={labelClass}>Current Password</label>
                        <input
                          {...regPwd('currentPassword', { required: 'Current password is required' })}
                          type="password"
                          className={inputClass}
                          placeholder="Enter your current password"
                        />
                        {pwdErrors.currentPassword && <p className={errorClass}>⚠ {pwdErrors.currentPassword.message}</p>}
                      </div>

                      <div className="border-t border-dashed border-gray-100" />

                      <div>
                        <label className={labelClass}>New Password</label>
                        <input
                          {...regPwd('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Must be at least 8 characters' } })}
                          type="password"
                          className={inputClass}
                          placeholder="Min. 8 characters"
                        />
                        {pwdErrors.newPassword && <p className={errorClass}>⚠ {pwdErrors.newPassword.message}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Confirm New Password</label>
                        <input
                          {...regPwd('confirmPassword', { required: 'Please confirm your new password', validate: (v) => v === newPwdValue || 'Passwords do not match' })}
                          type="password"
                          className={inputClass}
                          placeholder="Re-enter new password"
                        />
                        {pwdErrors.confirmPassword && <p className={errorClass}>⚠ {pwdErrors.confirmPassword.message}</p>}
                      </div>

                      <MsgBox msg={passwordMsg} />

                      <div className="flex gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={passwordSaving}
                          className="flex-1 py-2.5 bg-[#1e40af] text-white rounded-xl text-sm font-bold hover:bg-[#1c3e9c] transition disabled:opacity-50 shadow-md shadow-blue-100"
                        >
                          {passwordSaving ? (
                            <span className="flex items-center justify-center gap-2"><Spinner /> Updating…</span>
                          ) : 'Update Password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsChangingPassword(false); setPasswordMsg(null); resetPassword(); }}
                          className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}