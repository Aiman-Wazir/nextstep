import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CareerPath AI
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover your ideal career path using AI-powered recommendations
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/profile"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/recommendations"
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              View Recommendations
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Personalized</h3>
              <p className="text-gray-600">Get career matches based on your unique skills</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">AI-Powered</h3>
              <p className="text-gray-600">Advanced AI analyzes your profile</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your learning journey</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}