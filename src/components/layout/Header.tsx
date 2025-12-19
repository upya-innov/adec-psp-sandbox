'use client';

import { Code, BookOpen, Settings, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Code className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ADEC PSP Sandbox</h1>
            <p className="text-sm text-gray-600">Testez l&apos;API PSP en temps réel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <BookOpen className="h-5 w-5" />
            <span className="hidden md:inline">Documentation</span>
          </button>

          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Settings className="h-5 w-5" />
            <span className="hidden md:inline">Paramètres</span>
          </button>

          <div className="h-8 w-px bg-gray-200" />

          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <User className="h-5 w-5" />
            <span className="hidden md:inline">Mon compte</span>
          </button>
        </div>
      </div>
    </header>
  );
}