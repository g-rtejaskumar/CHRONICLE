import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import GlowPointer from './components/GlowPointer'
import ScrollToTop from './components/ScrollToTop'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        dispatch(login(userData))
      }
      else{
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [dispatch])

  return !loading ? (
    <div className='relative min-h-screen flex flex-wrap content-between bg-[#05060c] text-slate-100 selection:bg-violet-500/40'>
      <ScrollToTop />
      <GlowPointer />

      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='orb orb-violet' style={{ width: '38rem', height: '38rem', top: '-12rem', left: '-10rem', opacity: 0.35 }} />
        <div className='orb orb-cyan' style={{ width: '30rem', height: '30rem', bottom: '-10rem', right: '-8rem', opacity: 0.28 }} />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.14),transparent_55%)]' />
        <div className='absolute inset-0 opacity-[0.035]' style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27%3E%3Cpath d=%27M0 39.5H40M39.5 0V40%27 stroke=%27%23ffffff%27 stroke-opacity=%270.6%27 fill=%27none%27/%3E%3C/svg%3E")' }} />
      </div>

      <div className='w-full block'>
        <Header />
        <main className='relative z-10'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center bg-[#05060c]'>
      <div className='relative flex h-16 w-16 items-center justify-center'>
        <span className='pulse-ring absolute h-16 w-16 rounded-full border border-violet-400/60' />
        <span className='h-4 w-4 animate-ping rounded-full bg-gradient-to-br from-violet-400 to-cyan-300' />
      </div>
    </div>
  )
}

export default App
