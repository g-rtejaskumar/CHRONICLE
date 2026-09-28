import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'
import Container from '../container/Container'
import Reveal from '../Reveal'

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Featured Feed', to: '/#featured' },
      { label: 'All Chronicles', to: '/all-posts' },
      { label: 'Creator Studio', to: '/add-post' },
      { label: 'GitHub Repository', href: 'https://github.com/g-rtejaskumar/CHRONICLE' },
    ],
  },
  {
    title: 'Topics',
    links: [
      { label: 'Engineering Architecture', to: '/all-posts' },
      { label: 'Spatial & 3D UI', to: '/all-posts' },
      { label: 'Autonomous AI Agents', to: '/all-posts' },
      { label: 'Startup Velocity', to: '/all-posts' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Sign In', to: '/login' },
      { label: 'Join Chronicle Free', to: '/signup' },
      { label: 'Back to Top ↑', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    ],
  },
]

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/g-rtejaskumar/CHRONICLE' },
  { label: 'X', href: 'https://twitter.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]

function Footer() {
  return (
    <footer id="site-footer" className="hairline relative overflow-hidden border-t border-white/10 bg-[#07080f]/80 pt-20 backdrop-blur-xl">
      <div className="orb orb-violet" style={{ width: '22rem', height: '22rem', top: '-8rem', right: '-6rem', opacity: 0.28 }} />
      <div className="orb orb-cyan" style={{ width: '18rem', height: '18rem', bottom: '-8rem', left: '-5rem', opacity: 0.22 }} />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block rounded-2xl bg-white/95 p-2 shadow-[0_16px_40px_-20px_rgba(139,92,246,1)] transition-transform duration-500 hover:-rotate-6">
                <Logo width="52px" />
              </span>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
              Chronicle is a cinematic home for long-form thinking — depth,
              motion and craft wrapped around every story you publish.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-3d rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-[0_16px_30px_-18px_rgba(34,211,238,1)]"
                >
                  {social.label} ↗
                </a>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((column, index) => (
              <Reveal key={column.title} delay={index * 110}>
                <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-3d text-sm text-slate-400 hover:text-white"
                        >
                          {link.label} ↗
                        </a>
                      ) : link.onClick ? (
                        <button
                          type="button"
                          onClick={link.onClick}
                          className="link-3d text-sm text-slate-400 hover:text-cyan-300 text-left"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          to={link.to}
                          className="link-3d text-sm text-slate-400 hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 select-none overflow-hidden border-t border-white/10 pt-10">
          <p className="font-display text-center text-4xl font-extrabold leading-none text-white/[0.06] sm:text-6xl lg:text-7xl">
            CHRONICLE
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Chronicle. Crafted with depth.</p>
          <p className="tracking-[0.3em] uppercase">Designed to be felt</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
