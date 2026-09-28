import { useId, forwardRef, useState } from 'react';

const Input = forwardRef(function Input(
  { 
    label, 
    type = 'text', 
    className = '', 
    error,
    ...props 
  }, ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={effectiveType}
          ref={ref}
          {...props}
          className={`w-full rounded-xl border bg-white/[0.05] px-4 py-3 ${isPassword ? 'pr-11' : ''} text-sm text-slate-100 placeholder:text-slate-500 outline-none backdrop-blur-md transition-all duration-300 focus:bg-white/[0.08] focus:shadow-[0_0_24px_rgba(34,211,238,0.2)] ${
            error
              ? 'border-rose-500/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
              : 'border-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
          } ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
});

export default Input;