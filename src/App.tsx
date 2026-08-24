import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { useNotification } from './hooks/useNotification'

function App() {
  const [count, setCount] = useState(0)

  const { notifications } = useNotification('1');

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          <span className='text-white'>Count is {count}</span>
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <div className="w-full max-w-md rounded-xl border border-slate-700/60 bg-slate-900/50 p-5 shadow-lg backdrop-blur-md text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="m-0 text-base font-semibold text-slate-100">
                Notifikasi Real-time
              </h3>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/20">
                {notifications.length} Baru
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                <span className="text-2xl block mb-1 opacity-70">🔔</span>
                <p className="text-sm m-0">Belum ada notifikasi baru.</p>
              </div>
            ) : (
              <ul className="m-0 p-0 list-none space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.map((msg, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-800/40 p-3 text-sm text-slate-200 transition hover:bg-slate-800/80"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    <p className="m-0 leading-relaxed">{msg.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
