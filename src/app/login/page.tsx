'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    
    // Try to sign in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/') // Redirect to home on success
      router.refresh()
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    
    // Create new user
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setError('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  return (
    // Changed: Set height to exactly the screen height and added a constant padding (p-6 md:p-8)
    <div className="h-screen w-full flex p-6 md:p-8 bg-black text-white bg-[url('/menu-bg.jpg')] bg-cover">

        {/* Changed: h-full (respects parent padding), rounded-3xl restored, borders restored all around */}
        <div className="h-full w-full max-w-4xl bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl p-10 md:p-14 shadow-2xl flex flex-col justify-center relative z-10">
          
          {/* Logo */}
          <div className="absolute top-10 left-10 h-13 w-48 bg-contain bg-no-repeat" style={{ backgroundImage: "url('/logo5.png')" }}>
          </div> 

          <h1 className="text-3xl font-regular tracking-widest text-center font-regular">Log in</h1>
          <p className="text-xs font-regular mb-5 text-white/50 tracking-widest text-center font-regular">Created by and for the personal use of Lance</p>
        
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
              className="w-full bg-[] hover:bg-[#d94db0]/20 border border-sm text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50"
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
          <p className="absolute bottom-10 left-10 text-left text-xs text-white/50">
          Use 'test@cinehoria.com' & '123' to test <br></br>it out. Email 'cinehoria@gmail.com' for free access. <br></br>Do not use as your primary screenplay editor.
          </p>
        </div>
    </div>
  )
}