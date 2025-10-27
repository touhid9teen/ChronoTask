"use client";
import Link from "next/link";
import React from "react";

export default function AppFooter() {
  return (
    <footer className=" w-full py-6 text-center text-xs text-gray-500 border-t mt-10">
      <p>
        © 2025 ChronoTask •{" "}
        <Link href="/terms-and-service" className="underline">
          Terms of Service
        </Link>
      </p>
    </footer>
  );
}
