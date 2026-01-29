'use client';

import { Code, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="text-white p-2 rounded-lg"
            style={{ backgroundColor: '#0b2635' }}
          >
            <Code className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FineoPay API Explorer</h1>
            <p className="text-sm text-gray-600">Tester et explorer l&apos;API de paiement en temps réel</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-[#0b2635] transition-colors font-medium"
          >
            <Code className="h-5 w-5" />
            <span>API Explorer</span>
          </Link>

          <Link
            href="/documentation"
            className="flex items-center gap-2 text-gray-700 hover:text-[#0b2635] transition-colors font-medium"
          >
            <BookOpen className="h-5 w-5" />
            <span>Documentation</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}