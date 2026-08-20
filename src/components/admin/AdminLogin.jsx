import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, KeyRound, ArrowRight, X, AlertCircle, Loader2 } from 'lucide-react'
import { useContent } from '../../context/ContentContext'

export default function AdminLogin({ isOpen, onClose, onSuccess }) {
  const { login, isBackendConfigured, isPasscodeEnabled } = useContent()
  const [loginMode, setLoginMode] = useState('email') // 'email' or 'passcode'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let res
      if (loginMode === 'email') {
        res = await login(email, password)
      } else {
        res = await login(passcode)
      }

      if (res && res.success) {
        setEmail('')
        setPassword('')
        setPasscode('')
        if (onSuccess) onSuccess()
      } else {
        setError(res?.error || 'Access denied. Please check your credentials.')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-charcoal/10 overflow-hidden relative"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-charcoal transition-colors rounded-full hover:bg-sand/40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#FAF8F5] p-6 sm:p-8 text-center border-b border-charcoal/10">
          <div className="w-12 h-12 rounded-2xl bg-charcoal text-copper mx-auto flex items-center justify-center mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-bold tracking-tight uppercase">
            Admin Portal
          </h3>
          <p className="text-xs text-charcoal-muted font-sans mt-1">
            Supabase Protected Owner Management Panel
          </p>

          {/* Mode Switcher */}
          <div className="mt-4 flex bg-charcoal/5 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setLoginMode('email')
                setError('')
              }}
              className={`flex-1 py-1.5 text-xs font-sans font-bold uppercase rounded-lg transition-all ${
                loginMode === 'email' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/60'
              }`}
            >
              Supabase Auth
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('passcode')
                setError('')
              }}
              className={`flex-1 py-1.5 text-xs font-sans font-bold uppercase rounded-lg transition-all ${
                loginMode === 'passcode' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/60'
              }`}
            >
              Master PIN
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {!isBackendConfigured && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900 font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                This site was built without Supabase credentials, so email sign-in
                cannot work. Set <strong>VITE_SUPABASE_URL</strong> and{' '}
                <strong>VITE_SUPABASE_ANON_KEY</strong> in your hosting environment,
                then redeploy.
                {isPasscodeEnabled && ' The Master PIN still opens the panel read-only.'}
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700 font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loginMode === 'email' ? (
            <>
              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase tracking-wider">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tilnogz.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-charcoal/20 rounded-xl text-xs font-sans text-charcoal focus:outline-none focus:border-copper focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-charcoal/20 rounded-xl text-xs font-sans text-charcoal focus:outline-none focus:border-copper focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase tracking-wider">
                Enter Master Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-charcoal/20 rounded-xl text-sm font-sans text-charcoal focus:outline-none focus:border-copper focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold tracking-widest uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
