"use client";

import { privacyPolicy } from "@/lib/variable";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-2xl w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

        {privacyPolicy.map((section, idx) => (
          <div key={idx} className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            {Array.isArray(section.content) ? (
              <ul className="list-disc list-inside">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{section.content}</p>
            )}
          </div>
        ))}

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
