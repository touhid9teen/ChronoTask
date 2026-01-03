"use client";

import Link from "next/link";
import { Clock, Cloud, Lock, Zap, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ChronoTask</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Privacy Policy
            </Link>
            <Link href="/terms-and-service" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Terms of Service
            </Link>
            <Link href="/">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Launch App
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Productivity Made Simple
        </div>
        
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Master Your Time with<br />
          <span className="text-blue-600">20-Minute Focus Sessions</span>
        </h2>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          ChronoTask is a productivity app that helps you break down your work into focused 
          20-minute intervals. Track your tasks, capture learning notes, and sync across 
          devices with optional Google Drive integration.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Why ChronoTask?</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">20-Minute Focus</h4>
            <p className="text-gray-600">
              Break your work into manageable 20-minute intervals to maintain focus and avoid burnout.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Task Management</h4>
            <p className="text-gray-600">
              Create, organize, and track your tasks with an intuitive interface designed for productivity.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Learning Notes</h4>
            <p className="text-gray-600">
              Capture insights and learnings as you work, building a knowledge base over time.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Offline-First PWA</h4>
            <p className="text-gray-600">
              Install as a Progressive Web App and use offline. Your data is stored locally on your device.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-cyan-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Google Drive Sync</h4>
            <p className="text-gray-600">
              Optionally sync your tasks across devices using your Google Drive account.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Privacy-Focused</h4>
            <p className="text-gray-600">
              Your data stays yours. We don't sell or share your information with third parties.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2">Create Your Tasks</h4>
              <p className="text-gray-600">
                Add tasks you want to accomplish. Break them down into 20-minute chunks.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2">Focus & Work</h4>
              <p className="text-gray-600">
                Work in focused 20-minute intervals. Capture notes and insights as you go.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2">Track Progress</h4>
              <p className="text-gray-600">
                Mark tasks complete and review your accomplishments. Sync across devices if needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Usage Section - IMPORTANT FOR GOOGLE VERIFICATION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">How We Use Your Google Data</h3>
          
          <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
            <p className="text-center mb-6">
              ChronoTask requests access to your Google account <strong>only for optional cloud syncing</strong>. 
              Here's exactly what we do with your data:
            </p>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                Google Drive Access
              </h4>
              <p className="text-sm">
                We request access to <code className="bg-gray-100 px-2 py-1 rounded">https://www.googleapis.com/auth/drive.file</code> scope, 
                which allows us to create and access <strong>only the files that ChronoTask creates</strong> in your Google Drive. 
                We cannot read, modify, or delete any other files in your Drive.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                What We Store
              </h4>
              <p className="text-sm">
                We only store your task data (titles, notes, completion status) in a dedicated folder in your Google Drive. 
                This data is used solely to sync your tasks across your devices.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Your Control
              </h4>
              <p className="text-sm">
                Cloud sync is <strong>completely optional</strong>. You can use ChronoTask entirely offline without 
                signing in to Google. You can revoke access at any time from your Google Account settings.
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
              Read our full Privacy Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Start tracking your tasks and achieving your goals in focused 20-minute sessions.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
              Launch ChronoTask Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">ChronoTask</span>
              </div>
              <p className="text-sm">
                A productivity app for focused work sessions and task management.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-service" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm">
                For support or questions:<br />
                <a href="mailto:touhid.ru66@gmail.com" className="hover:text-white transition">
                  touhid.ru66@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} ChronoTask. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
