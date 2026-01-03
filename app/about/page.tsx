"use client";

import Link from "next/link";
import { Clock, Cloud, Lock, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to App</span>
          </Link>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">ChronoTask</h1>
          </div>
          <nav className="flex gap-3 text-sm">
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition">
              Privacy
            </Link>
            <Link href="/terms-and-service" className="text-gray-600 hover:text-gray-900 transition">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Focus. Track. Achieve.
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          20-Minute Task Management
        </h2>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          ChronoTask helps you stay productive with focused 20-minute work sessions. 
          Track tasks, capture notes, and optionally sync across devices with Google Drive.
        </p>

        <Link href="/">
          <Button size="lg" className="gap-2">
            Launch App <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Features - Simplified Grid */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Key Features</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">20-Minute Focus</h4>
              <p className="text-gray-600 text-sm">
                Break work into manageable intervals to maintain focus and productivity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Offline-First PWA</h4>
              <p className="text-gray-600 text-sm">
                Install as a Progressive Web App. Works offline with local storage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Cloud className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Optional Cloud Sync</h4>
              <p className="text-gray-600 text-sm">
                Sync your tasks across devices using Google Drive (completely optional).
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Privacy-Focused</h4>
              <p className="text-gray-600 text-sm">
                Your data stays yours. No tracking, no ads, no data selling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Data Usage - Required for OAuth */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4 text-center">Google Data Usage</h3>
          
          <div className="max-w-2xl mx-auto space-y-4 text-sm text-gray-700">
            <p>
              ChronoTask requests Google account access <strong>only for optional cloud syncing</strong>:
            </p>

            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Google Drive:</strong> We use the <code className="bg-white px-1.5 py-0.5 rounded text-xs">drive.file</code> scope to save your tasks. We can only access files ChronoTask creates—nothing else in your Drive.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Profile Info:</strong> We access your email and name for authentication only.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Your Control:</strong> Cloud sync is optional. You can revoke access anytime from your Google Account settings.</span>
              </li>
            </ul>

            <div className="text-center mt-6 pt-4 border-t border-blue-200">
              <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium text-sm">
                Read Full Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">ChronoTask</span>
          </div>
          <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
            <Link href="/privacy-policy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-service" className="hover:text-gray-900">
              Terms of Service
            </Link>
            <span>•</span>
            <a href="mailto:touhid.ru66@gmail.com" className="hover:text-gray-900">
              Contact
            </a>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ChronoTask. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
