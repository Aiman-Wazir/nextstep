import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CareerPath AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Get Started
            </Link>
            <Link
              href="/recommendations"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Careers
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            AI-Powered Career Discovery
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            Find Your Ideal
            <span className="text-blue-600"> Career Path</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get personalized career recommendations based on your skills, interests, and experience.
            Powered by advanced AI and machine learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile" className="btn-primary">
              Start Your Journey
            </Link>
            <Link href="/recommendations" className="btn-secondary">
              Explore Careers
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50/80 py-20 border-t border-gray-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">How CareerPath AI Works</h2>
            <p className="section-subtitle">Three simple steps to discover your ideal career</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Create Your Profile</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Share your skills, interests, and experience level to build a complete professional profile.</p>
            </div>

            <div className="card text-center hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Get AI Recommendations</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Our AI analyzes your profile and matches you with careers that fit your unique strengths.</p>
            </div>

            <div className="card text-center hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Track Your Progress</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Follow a personalized learning roadmap and track your progress toward your career goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container text-center text-sm text-gray-500">
          <span className="font-medium text-gray-900">CareerPath AI</span>
          {' — '}
          Empowering your career journey with AI
        </div>
      </footer>
    </main>
  );
}