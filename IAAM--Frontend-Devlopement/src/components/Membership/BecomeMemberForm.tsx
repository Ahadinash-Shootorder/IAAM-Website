'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';

/* ===============================
   TYPES
================================= */

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  identifier: string;
  password: string;
}

interface Props {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
  onClose: () => void;
}

/* ===============================
   CONSTANTS
================================= */

const STRAPI_URL = 'https://admin.iaamonline.org';

/* ===============================
   PASSWORD RULES
================================= */

const PASSWORD_RULES = [
  { id: 'length',  label: 'At least 8 characters',       test: (v: string) => v.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter (A–Z)',   test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower',   label: 'One lowercase letter (a–z)',   test: (v: string) => /[a-z]/.test(v) },
  { id: 'number',  label: 'One number (0–9)',             test: (v: string) => /[0-9]/.test(v) },
  { id: 'special', label: 'One special character (!@#…)', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function getStrength(pwd: string) {
  const score = PASSWORD_RULES.filter((r) => r.test(pwd)).length;
  if (score <= 1) return { score, label: 'Very Weak',   color: '#ef4444' };
  if (score === 2) return { score, label: 'Weak',        color: '#f97316' };
  if (score === 3) return { score, label: 'Fair',        color: '#eab308' };
  if (score === 4) return { score, label: 'Strong',      color: '#22c55e' };
  return             { score, label: 'Very Strong',   color: '#10b981' };
}

/* ===============================
   DEBOUNCE HOOK
================================= */

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ===============================
   AVAILABILITY STATE TYPE
================================= */

type AvailState = 'idle' | 'checking' | 'available' | 'taken' | 'error';

/* ===============================
   MICRO COMPONENTS
================================= */

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

function ErrIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {msg}
    </div>
  );
}

function AvailBadge({ state, takenMsg }: { state: AvailState; takenMsg: string }) {
  if (state === 'idle')      return null;
  if (state === 'checking')  return (
    <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
      <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      Checking…
    </span>
  );
  if (state === 'available') return (
    <span className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
      Available
    </span>
  );
  if (state === 'taken') return (
    <span className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      {takenMsg}
    </span>
  );
  return null;
}

/* ===============================
   EYE ICON
================================= */

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

/* ===============================
   MAIN COMPONENT
================================= */

export default function BecomeMemberForm({ mode, onModeChange, onClose }: Props) {
  const { login } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [pwdFocused, setPwdFocused]     = useState(false);

  const [usernameState, setUsernameState] = useState<AvailState>('idle');
  const [emailState,    setEmailState]    = useState<AvailState>('idle');

  /* ---- Lock body scroll ---- */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ---- Register form ---- */
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset: resetRegister,
    setError: setRegError,
  } = useForm<RegisterData>({ mode: 'onChange' });

  const usernameValue = useWatch({ control, name: 'username', defaultValue: '' });
  const emailValue    = useWatch({ control, name: 'email',    defaultValue: '' });
  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });

  const debouncedUsername = useDebounce(usernameValue, 500);
  const debouncedEmail    = useDebounce(emailValue,    600);

  /* ---- Login form ---- */
  const {
    register: loginReg,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginData>();

  /* ---- Username availability check ---- */
  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.length < 3) {
      setUsernameState('idle');
      return;
    }
    setUsernameState('checking');
    fetch(`/api/auth/check-username?username=${encodeURIComponent(debouncedUsername)}`)
      .then((r) => r.json())
      .then((d) => setUsernameState(d.available ? 'available' : 'taken'))
      .catch(()  => setUsernameState('error'));
  }, [debouncedUsername]);

  /* ---- Email availability check ---- */
  useEffect(() => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!debouncedEmail || !emailRegex.test(debouncedEmail)) {
      setEmailState('idle');
      return;
    }
    setEmailState('checking');
    fetch(`/api/auth/check-email?email=${encodeURIComponent(debouncedEmail)}`)
      .then((r) => r.json())
      .then((d) => setEmailState(d.available ? 'available' : 'taken'))
      .catch(()  => setEmailState('error'));
  }, [debouncedEmail]);

  /* ---- Mode switch ---- */
  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setApiError('');
    setUsernameState('idle');
    setEmailState('idle');
    resetRegister();
    resetLogin();
    onModeChange(newMode);
  };

  /* ---- Password strength ---- */
  const pwd = passwordValue || '';
  const strength = getStrength(pwd);
  const allPassed = PASSWORD_RULES.every((r) => r.test(pwd));

  /* ---- Register submit ---- */
  const onRegisterSubmit = async (data: RegisterData) => {
    if (usernameState === 'taken') {
      setRegError('username', { message: 'Username is not available' });
      return;
    }
    if (emailState === 'taken') {
      setRegError('email', { message: 'Email is already registered' });
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const regRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email:    data.email,
          password: data.password,
        }),
      });

      const regJson = await regRes.json();

      if (!regRes.ok) {
        throw new Error(regJson?.error?.message || 'Registration failed. Please try again.');
      }

      login(regJson.user, regJson.jwt);
      onClose();
    } catch (e: any) {
      setApiError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Login submit ---- */
  const onLoginSubmit = async (data: LoginData) => {
    setIsSubmitting(true);
    setApiError('');
    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'Invalid credentials. Please try again.');
      login(json.user, json.jwt);
      onClose();
    } catch (e: any) {
      setApiError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Shared style helpers ---- */
  const labelClass = 'block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5';
  const errorClass = 'flex items-center gap-1 text-red-500 text-xs mt-1';

  const inputClass = (hasError: boolean, avail?: AvailState) => {
    const base = 'w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition pr-9 bg-white';
    if (hasError || avail === 'taken')     return `${base} border-red-400 focus:ring-red-100`;
    if (avail === 'available')             return `${base} border-emerald-400 focus:ring-emerald-100`;
    return `${base} border-gray-200 focus:ring-[#1e40af]/20 focus:border-[#1e40af]`;
  };

  /* ===============================
     RENDER
  ================================= */

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ═══ HEADER ═══ */}
        <div className="relative bg-[#1e40af] px-6 pt-6 pb-5 text-white overflow-hidden">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-black relative">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-blue-200 text-sm mt-0.5 relative">
            {mode === 'login'
              ? 'Sign in here'
              : 'Register with Us'}
          </p>
        </div>

        {/* ═══ BODY ═══ */}
        <div className="px-6 py-6">

          {/* ══════════ LOGIN ══════════ */}
          {mode === 'login' && (
            <form onSubmit={loginHandleSubmit(onLoginSubmit)} className="space-y-4">

              <div>
                <label className={labelClass}>Email or Username</label>
                <input
                  {...loginReg('identifier', { required: 'Email or username is required' })}
                  type="text"
                  className={inputClass(!!loginErrors.identifier)}
                  placeholder="your@email.com or username"
                  autoComplete="username"
                />
                {loginErrors.identifier && (
                  <p className={errorClass}><ErrIcon />{loginErrors.identifier.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    {...loginReg('password', { required: 'Password is required' })}
                    type={showLoginPwd ? 'text' : 'password'}
                    className={inputClass(!!loginErrors.password)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowLoginPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    <EyeIcon open={showLoginPwd} />
                  </button>
                </div>
                {loginErrors.password && (
                  <p className={errorClass}><ErrIcon />{loginErrors.password.message}</p>
                )}
              </div>

              {apiError && <ErrorBox msg={apiError} />}

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-[#1e40af] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#1c3e9c] transition disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? <><Spinner />Signing in…</> : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => handleModeSwitch('register')} className="text-[#1e40af] font-bold hover:underline">
                  Register here
                </button>
              </p>

            </form>
          )}

          {/* ══════════ REGISTER ══════════ */}
          {mode === 'register' && (
            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">

              {/* Username */}
              <div>
                <label className={labelClass}>Username</label>
                <div className="relative">
                  <input
                    {...register('username', {
                      required: 'Username is required',
                      minLength: { value: 3, message: 'At least 3 characters' },
                      maxLength: { value: 30, message: 'Max 30 characters' },
                      pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, underscores only' },
                    })}
                    type="text"
                    className={inputClass(!!errors.username, usernameState)}
                    placeholder="john_doe"
                    autoComplete="username"
                  />
                  {/* Inline status icon */}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {usernameState === 'checking'  && <span className="inline-block w-3.5 h-3.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />}
                    {usernameState === 'available' && <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                    {usernameState === 'taken'     && <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                  </span>
                </div>
                {errors.username
                  ? <p className={errorClass}><ErrIcon />{errors.username.message}</p>
                  : <AvailBadge state={usernameState} takenMsg="Username is not available" />
                }
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                    })}
                    type="email"
                    className={inputClass(!!errors.email, emailState)}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {emailState === 'checking'  && <span className="inline-block w-3.5 h-3.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />}
                    {emailState === 'available' && <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                    {emailState === 'taken'     && <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                  </span>
                </div>
                {errors.email
                  ? <p className={errorClass}><ErrIcon />{errors.email.message}</p>
                  : <AvailBadge state={emailState} takenMsg="Email is already registered" />
                }
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      validate: () => allPassed || 'Password does not meet all requirements',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className={inputClass(!!errors.password)}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    onFocus={() => setPwdFocused(true)}
                    onBlur={() => setPwdFocused(false)}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    <EyeIcon open={showPassword} />
                  </button>
                </div>

                {/* Strength bar */}
                {pwd.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((seg) => (
                        <div key={seg} className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: seg <= strength.score ? strength.color : '#e5e7eb' }} />
                      ))}
                    </div>
                    <p className="text-[11px] font-semibold" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className={errorClass}><ErrIcon />{errors.password.message}</p>
                )}
              </div>

              {apiError && <ErrorBox msg={apiError} />}

              <button
                type="submit"
                disabled={isSubmitting || usernameState === 'taken' || emailState === 'taken'}
                className="w-full bg-[#1e40af] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#1c3e9c] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Spinner />Creating Account…</> : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already a member?{' '}
                <button type="button" onClick={() => handleModeSwitch('login')} className="text-[#1e40af] font-bold hover:underline">
                  Sign in
                </button>
              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}



















































// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useAuth } from '@/context/AuthContext';

// /* ===============================
//    TYPES
// ================================= */

// interface RegisterData {
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   phone?: string;
//   password: string;
//   biography: string;
// }

// interface LoginData {
//   identifier: string;
//   password: string;
// }

// interface Props {
//   mode: 'login' | 'register';
//   onModeChange: (mode: 'login' | 'register') => void;
//   onClose: () => void;
// }

// /* ===============================
//    CONSTANTS
// ================================= */

// const STRAPI_URL = 'https://admin.iaamonline.org';

// const REGISTER_STEPS = [
//   {
//     title: 'Personal Info',
//     subtitle: 'Tell us who you are',
//     fields: ['firstName', 'lastName', 'username'] as const,
//   },
//   {
//     title: 'Contact & Security',
//     subtitle: 'How can we reach you?',
//     fields: ['email', 'phone', 'password'] as const,
//   },
//   {
//     title: 'About You',
//     subtitle: 'Share your background',
//     fields: ['biography'] as const,
//   },
// ];

// /* ===============================
//    COMPONENT
// ================================= */

// export default function BecomeMemberForm({ mode, onModeChange, onClose }: Props) {
//   const { login } = useAuth();

//   const [step, setStep] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState('');

//   /* ---------- Register form ---------- */
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     trigger,
//     reset: resetRegister,
//   } = useForm<RegisterData>();

//   /* ---------- Login form ---------- */
//   const {
//     register: loginRegister,
//     handleSubmit: loginHandleSubmit,
//     formState: { errors: loginErrors },
//     reset: resetLogin,
//   } = useForm<LoginData>();

//   /* ===============================
//      HANDLERS
//   ================================= */

//   const handleNextStep = async () => {
//     const valid = await trigger(REGISTER_STEPS[step].fields as any);
//     if (valid) {
//       setApiError('');
//       setStep((s) => s + 1);
//     }
//   };

//   const handlePrevStep = () => {
//     setApiError('');
//     setStep((s) => s - 1);
//   };

//   const handleModeSwitch = (newMode: 'login' | 'register') => {
//     setStep(0);
//     setApiError('');
//     resetRegister();
//     resetLogin();
//     onModeChange(newMode);
//   };

//   /* ---- Register: two-step (core fields first, then PATCH custom fields) ---- */
//   const onRegisterSubmit = async (data: RegisterData) => {
//     setIsSubmitting(true);
//     setApiError('');
//     try {
//       // Step 1 — core registration
//       const registerRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username: data.username,
//           email: data.email,
//           password: data.password,
//         }),
//       });

//       const registerJson = await registerRes.json();

//       if (!registerRes.ok) {
//         throw new Error(
//           registerJson?.error?.message || 'Registration failed. Please try again.'
//         );
//       }

//       const { jwt, user } = registerJson;

//       // Step 2 — PATCH custom fields
//       const updateRes = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${jwt}`,
//         },
//         body: JSON.stringify({
//           FirstName: data.firstName,
//           LastName: data.lastName,
//           Phone: data.phone || '',
//           Biography: [
//             {
//               type: 'paragraph',
//               children: [{ type: 'text', text: data.biography }],
//             },
//           ],
//         }),
//       });

//       const updateJson = await updateRes.json();
//       const finalUser = updateRes.ok ? { ...user, ...updateJson } : user;

//       login(finalUser, jwt);
//       onClose();
//     } catch (e: any) {
//       setApiError(e.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ---- Login ---- */
//   const onLoginSubmit = async (data: LoginData) => {
//     setIsSubmitting(true);
//     setApiError('');
//     try {
//       const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         throw new Error(json?.error?.message || 'Invalid credentials. Please try again.');
//       }

//       login(json.user, json.jwt);
//       onClose();
//     } catch (e: any) {
//       setApiError(e.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ===============================
//      SHARED STYLES
//   ================================= */

//   const inputClass =
//     'w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition';

//   const errorClass = 'text-red-500 text-xs mt-1';

//   /* ===============================
//      RENDER
//   ================================= */

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">

//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-white hover:text-white/60 text-xl leading-none z-10"
//           aria-label="Close"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <div className="bg-[#1e40af] px-6 pt-6 pb-5 text-white">
//           <h2 className="text-xl font-bold">
//             {mode === 'login' ? 'Welcome Back' : 'Join IAAM'}
//           </h2>
//           <p className="text-blue-200 text-sm mt-0.5">
//             {mode === 'login' ? 'Sign in to your account' : REGISTER_STEPS[step].subtitle}
//           </p>

//           {/* Step indicator */}
//           {mode === 'register' && (
//             <div className="flex items-center gap-2 mt-4">
//               {REGISTER_STEPS.map((s, i) => (
//                 <div key={i} className="flex items-center gap-2">
//                   <div
//                     className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
//                       i < step
//                         ? 'bg-green-400 border-green-400 text-white'
//                         : i === step
//                         ? 'bg-white border-white text-[#1e40af]'
//                         : 'bg-transparent border-blue-300 text-blue-300'
//                     }`}
//                   >
//                     {i < step ? '✓' : i + 1}
//                   </div>
//                   {i < REGISTER_STEPS.length - 1 && (
//                     <div className={`h-0.5 w-8 ${i < step ? 'bg-green-400' : 'bg-blue-400'}`} />
//                   )}
//                 </div>
//               ))}
//               <span className="ml-2 text-xs text-blue-200">
//                 {REGISTER_STEPS[step].title}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5">

//           {/* ===== LOGIN ===== */}
//           {mode === 'login' && (
//             <form onSubmit={loginHandleSubmit(onLoginSubmit)} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email or Username *
//                 </label>
//                 <input
//                   {...loginRegister('identifier', { required: 'Email or username is required' })}
//                   type="text"
//                   className={inputClass}
//                   placeholder="your@email.com or username"
//                 />
//                 {loginErrors.identifier && (
//                   <p className={errorClass}>{loginErrors.identifier.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password *
//                 </label>
//                 <input
//                   {...loginRegister('password', { required: 'Password is required' })}
//                   type="password"
//                   className={inputClass}
//                   placeholder="Enter your password"
//                 />
//                 {loginErrors.password && (
//                   <p className={errorClass}>{loginErrors.password.message}</p>
//                 )}
//               </div>

//               {apiError && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
//                   {apiError}
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-[#1e40af] text-white py-2.5 rounded-md text-sm font-semibold hover:bg-[#1c3e9c] transition disabled:opacity-50"
//               >
//                 {isSubmitting ? 'Signing in…' : 'Sign In'}
//               </button>

//               <p className="text-center text-sm text-gray-600">
//                 Don't have an account?{' '}
//                 <button
//                   type="button"
//                   onClick={() => handleModeSwitch('register')}
//                   className="text-[#1e40af] font-semibold hover:underline"
//                 >
//                   Register here
//                 </button>
//               </p>
//             </form>
//           )}

//           {/* ===== REGISTER ===== */}
//           {mode === 'register' && (
//             <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">

//               {/* Step 1 */}
//               {step === 0 && (
//                 <>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
//                       <input
//                         {...register('firstName', { required: 'Required' })}
//                         type="text"
//                         className={inputClass}
//                         placeholder="John"
//                       />
//                       {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
//                       <input
//                         {...register('lastName', { required: 'Required' })}
//                         type="text"
//                         className={inputClass}
//                         placeholder="Doe"
//                       />
//                       {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
//                     <input
//                       {...register('username', {
//                         required: 'Username is required',
//                         minLength: { value: 3, message: 'At least 3 characters' },
//                         pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, underscores only' },
//                       })}
//                       type="text"
//                       className={inputClass}
//                       placeholder="john_doe"
//                     />
//                     {errors.username && <p className={errorClass}>{errors.username.message}</p>}
//                   </div>
//                 </>
//               )}

//               {/* Step 2 */}
//               {step === 1 && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//                     <input
//                       {...register('email', {
//                         required: 'Email is required',
//                         pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
//                       })}
//                       type="email"
//                       className={inputClass}
//                       placeholder="your@email.com"
//                     />
//                     {errors.email && <p className={errorClass}>{errors.email.message}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Phone <span className="text-gray-400 font-normal">(Optional)</span>
//                     </label>
//                     <input
//                       {...register('phone')}
//                       type="tel"
//                       className={inputClass}
//                       placeholder="+1 (555) 123-4567"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
//                     <input
//                       {...register('password', {
//                         required: 'Password is required',
//                         minLength: { value: 8, message: 'Min. 8 characters' },
//                       })}
//                       type="password"
//                       className={inputClass}
//                       placeholder="Min. 8 characters"
//                     />
//                     {errors.password && <p className={errorClass}>{errors.password.message}</p>}
//                   </div>
//                 </>
//               )}

//               {/* Step 3 */}
//               {step === 2 && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Biography *</label>
//                   <textarea
//                     {...register('biography', {
//                       required: 'Biography is required',
//                       minLength: { value: 30, message: 'Please write at least 30 characters' },
//                     })}
//                     rows={5}
//                     className={`${inputClass} resize-none`}
//                     placeholder="Tell us about yourself, your background, research interests, and why you want to join IAAM…"
//                   />
//                   {errors.biography && <p className={errorClass}>{errors.biography.message}</p>}
//                   <p className="text-gray-400 text-xs mt-1">Minimum 30 characters</p>
//                 </div>
//               )}

//               {apiError && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
//                   {apiError}
//                 </div>
//               )}

//               {/* Navigation */}
//               <div className="flex gap-3 pt-1">
//                 {step > 0 && (
//                   <button
//                     type="button"
//                     onClick={handlePrevStep}
//                     className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-md text-sm font-semibold hover:bg-gray-50 transition"
//                   >
//                     ← Back
//                   </button>
//                 )}
//                 {step < REGISTER_STEPS.length - 1 ? (
//                   <button
//                     type="button"
//                     onClick={handleNextStep}
//                     className="flex-1 bg-[#1e40af] text-white py-2.5 rounded-md text-sm font-semibold hover:bg-[#1c3e9c] transition"
//                   >
//                     Next →
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="flex-1 bg-[#1e40af] text-white py-2.5 rounded-md text-sm font-semibold hover:bg-[#1c3e9c] transition disabled:opacity-50"
//                   >
//                     {isSubmitting ? 'Submitting…' : 'Submit Application'}
//                   </button>
//                 )}
//               </div>

//               <p className="text-center text-sm text-gray-600">
//                 Already a member?{' '}
//                 <button
//                   type="button"
//                   onClick={() => handleModeSwitch('login')}
//                   className="text-[#1e40af] font-semibold hover:underline"
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }