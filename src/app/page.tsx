// app/page.tsx
import { Code2, Bot, Brain, Zap, Shield, Users, ChevronRight, Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-indigo-500" />
          <span className="text-2xl font-bold text-white">CodePilot</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">How It Works</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">About</a>
        </div>
        
        <div className="flex space-x-4">
          <button className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors">
            Sign In
          </button>
          <button className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Learn & Code with <span className="text-indigo-500">AI Assistance</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10">
            CodePilot helps beginners learn programming through an interactive AI-powered platform. Write, test, and debug code with real-time guidance from our intelligent assistant.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md flex items-center justify-center transition-colors">
              Start Coding Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-md flex items-center justify-center transition-colors">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Learning Features</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to start your coding journey with confidence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-indigo-800 transition-colors duration-300">
              <div className="bg-indigo-900/30 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Bot className="h-7 w-7 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Assistant</h3>
              <p className="text-slate-400">
                Get instant explanations, debugging help, and answers to all your programming questions from our intelligent AI assistant.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-pink-900 transition-colors duration-300">
              <div className="bg-pink-900/30 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Code2 className="h-7 w-7 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Coding</h3>
              <p className="text-slate-400">
                Write and test code directly in the browser with our powerful editor and instant execution environment.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-emerald-800 transition-colors duration-300">
              <div className="bg-emerald-900/30 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Hints</h3>
              <p className="text-slate-400">
                Receive contextual suggestions and improvements to your code without giving away the solution.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-amber-800 transition-colors duration-300">
              <div className="bg-amber-900/30 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Feedback</h3>
              <p className="text-slate-400">
                See the results of your code immediately and understand what's happening with detailed output explanations.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-purple-800 transition-colors duration-300">
              <div className="bg-purple-900/30 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Safe Environment</h3>
              <p className="text-slate-400">
                Experiment without fear of breaking anything. All code runs in a secure sandboxed environment.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-cyan-800 transition-colors duration-300">
              <div className="bg-cyan-900/30 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-cyan-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Community Support</h3>
              <p className="text-slate-400">
                Connect with other learners, share your projects, and get feedback from a supportive community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How CodePilot Works</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Start your coding journey in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-indigo-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-500">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Write Code</h3>
              <p className="text-slate-400">
                Use our intuitive code editor to write and experiment with code in various programming languages.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-500">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get AI Assistance</h3>
              <p className="text-slate-400">
                Chat with our AI assistant to get explanations, debug errors, and receive personalized learning guidance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-500">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Master Programming</h3>
              <p className="text-slate-400">
                Build projects, complete challenges, and track your progress as you become a confident programmer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Coding Journey?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Join thousands of learners who are building their programming skills with AI assistance
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-lg font-semibold transition-colors">
              Create Free Account
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-lg font-semibold transition-colors">
              Take a Tour
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Code2 className="h-8 w-8 text-indigo-500" />
                <span className="text-2xl font-bold text-white">CodePilot</span>
              </div>
              <p className="text-slate-400 max-w-md">
                An AI-powered coding platform designed to help beginners learn programming through interactive coding and intelligent assistance.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Examples</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p>© {new Date().getFullYear()} CodePilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}