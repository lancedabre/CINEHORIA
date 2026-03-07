'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function LoginPage() {
  const [view, setView] = useState<'welcome' | 'form'>('welcome')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/') 
      router.refresh()
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      setError('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  const galleryImages = [
    '/1.png',
    '/2b.png', 
    '/3.png',
  ];

  // Determine which background image to show based on the active view
  const backgroundImage = view === 'welcome' 
    ? "url('/blur-bg.png')" // Change this to whatever you want the landing background to be
    : "url('/menu-bg.jpg')" // The background for the glass form

  return (
    <div 
  className={`h-screen w-full flex items-center p-6 md:p-8 relative overflow-hidden transition-all duration-700 bg-cover bg-center ${
    view === 'welcome' ? 'justify-center' : 'justify-start'
  }`}
  style={{ backgroundImage }}
>
        {/* Dark overlay to make sure cards stand out */}
        <div className="absolute inset-0 bg-black/40 -z-10" />

        {/* CUSTOM CSS FOR THE CONTINUOUS MARQUEE ANIMATION */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}} />

        {/* ========================================= */}
        {/* 1. THE WELCOME / LANDING CARD VIEW          */}
        {/* ========================================= */}
        {view === 'welcome' && (
          <div className="w-full max-w-[360px] bg-white rounded-4xl py-8 flex flex-col items-center justify-center relative z-10 animate-in fade-in zoom-in-95 duration-500 text-black">
            <div className="px-8 flex flex-col items-center w-full">
            {/* Dark Logo for the white card */}
            <div className="h-10 w-36 bg-contain bg-center bg-no-repeat mb-6" style={{ backgroundImage: "url('/logo5.png')" }} />

            <h1 className="text-2xl text-center">Join Cinehoria</h1>
            <p className="text-gray-500 text-sm text-center mb-8 px-2 leading-relaxed tracking-wide">
               Professional screenwriting software.
            </p>
</div>
            {/* Scrolling Gallery Strip */}
            <div className="w-full h-32 overflow-hidden relative mb-8">
              <div className="flex w-[200%] h-full animate-marquee">
                {galleryImages.map((src, i) => (
                  <div key={`first-${i}`} className="w-1/6 h-full relative border-r border-white">
                    <Image src={src} alt="Gallery image" fill className="object-cover" />
                  </div>
                ))}
                {galleryImages.map((src, i) => (
                  <div key={`second-${i}`} className="w-1/6 h-full relative border-r border-white">
                    <Image src={src} alt="Gallery image" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="px-8 w-full flex flex-col">
            {/* Buttons */}
            <button 
              onClick={() => setView('form')} 
              className="w-full bg-black text-white text-sm rounded-4xl py-3.5 mb-3 hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
            <button 
              onClick={() => setView('form')} 
              className="w-full bg-white text-black text-sm  rounded-4xl py-3.5 hover:bg-gray-50 transition-colors"
            >
              Log In
            </button>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* 2. THE GLASS BOX FORM VIEW                  */}
        {/* ========================================= */}
        {view === 'form' && (
          <div className="h-full w-full max-w-3xl bg-black backdrop-blur-md border border-white/20 rounded-3xl p-10 md:p-14 shadow-2xl flex flex-col justify-center relative z-10 animate-in fade-in zoom-in-95 duration-500 text-white">
            
            {/* Logo */}
            <div className="absolute top-10 left-10 h-13 w-48 bg-contain bg-no-repeat" style={{ backgroundImage: "url('/logo5.png')" }} />

            {/* Back Button */}
            <button 
              onClick={() => setView('welcome')}
              className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
            >
              ← Back
            </button>

            <div className="w-full max-w-md mx-auto relative">
              <h1 className="text-3xl text-center">Log in</h1>
              <p className="text-xs font-regular mb-5 text-white/50 tracking-widest text-center font-regular">Screenwriting software</p>
            
              <div className="space-y-5">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 outline-none focus:border-[#eb60c3] transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 outline-none focus:border-[#eb60c3] transition-colors"
                />
                
                {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}

                <button 
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-[] hover:bg-white/20 border border-transparent text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Log In'}
                </button>

                <button 
                  onClick={handleSignUp}
                  disabled={loading}
                  className="w-full bg-transparent hover:bg-white/5 text-gray-300 font-medium py-3 rounded-xl transition-all text-sm"
                >
                  Sign Up
                </button>
              </div>
            </div>

            <p className="absolute bottom-10 left-10 text-left text-xs text-white/50">
              Use 'test@cinehoria.com' & '123' to test <br></br>it out. Email 'cinehoria@gmail.com' for free access. <br></br>Do not use as your primary screenplay editor.
            </p>
          </div>
        )}

    </div>
  )
}