import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-ember to-ember-dark flex items-center justify-center ember-glow">
          <svg 
            viewBox="0 0 100 100" 
            className="w-16 h-16 text-black"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Abstract wave logo */}
            <path 
              d="M10 60 Q 25 40, 40 60 T 70 60 T 90 50" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeLinecap="round"
              fill="none"
            />
            <path 
              d="M15 70 Q 30 50, 45 70 T 75 70 T 95 60" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            <path 
              d="M20 80 Q 35 60, 50 80 T 80 80 T 100 70" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-6xl font-bold text-cream mb-4 tracking-tight">
        <span className="text-ember">F</span>lume
      </h1>
      
      <p className="text-xl text-gray-400 mb-12 max-w-md text-center">
        Your personal command center. Build, organize, ship.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <Link href="/board" className="btn-ember px-8 py-3 text-lg">
          Get Started
        </Link>
        <Link href="https://github.com/tylerdotai/flume" className="btn-ghost px-8 py-3 text-lg">
          View on GitHub
        </Link>
      </div>

      {/* Features preview */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="card p-6 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="text-lg font-semibold text-cream mb-1">Fast</h3>
          <p className="text-gray-500 text-sm">Lightning quick updates with WebSockets</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl mb-2">🎨</div>
          <h3 className="text-lg font-semibold text-cream mb-1">Beautiful</h3>
          <p className="text-gray-500 text-sm">Ember theme designed to impress</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="text-lg font-semibold text-cream mb-1">Yours</h3>
          <p className="text-gray-500 text-sm">Self-hosted, your data stays local</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-gray-600 text-sm">
        Built by <a href="https://github.com/tylerdotai" className="text-ember hover:underline">@tylerdotai</a>
      </div>
    </main>
  )
}
