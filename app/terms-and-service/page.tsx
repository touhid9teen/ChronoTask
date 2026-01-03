"use client";
import { sections } from "@/lib/variable";
import Link from "next/link";
import React from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/about" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-150 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">ChronoTask</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">
              Please read these terms carefully before using ChronoTask
            </p>
          </div>

          <div className="prose prose-blue max-w-none">
            {sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4 justify-center">
            <Link href="/about" className="cursor-pointer">
              <Button variant="outline" className="cursor-pointer transition-all duration-150 hover:scale-105">
                Back to Home
              </Button>
            </Link>
            <Link href="/privacy-policy" className="cursor-pointer">
              <Button variant="outline" className="cursor-pointer transition-all duration-150 hover:scale-105">
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}