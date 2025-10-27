"use client";
import { sections } from "@/lib/variable";
import Link from "next/link";
import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-6 ">Terms of Service</h1>

      {sections.map((section, idx) => (
        <div key={idx} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
          <p className="mb-2">{section.content}</p>
        </div>
      ))}
      <div className="mt-6 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
  