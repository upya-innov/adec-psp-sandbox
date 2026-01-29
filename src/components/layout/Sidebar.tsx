'use client';

import { Endpoint } from '@/types/openapi';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Globe,
  CreditCard,
  Send,
  Database,
} from 'lucide-react';

interface SidebarProps {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  onSelectEndpoint: (endpoint: Endpoint) => void;
  onScrollToApiTester?: () => void;
}

export default function Sidebar({
  endpoints,
  selectedEndpoint,
  onSelectEndpoint,
  onScrollToApiTester
}: SidebarProps) {
  const orderedTags = [
    'Payments',
    'Transfers',
    'Countries',
    'Currencies',
    'Channels',
  ];

  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>(
    Object.fromEntries(orderedTags.map((t, i) => [t, i < 6]))
  );

  const endpointsByTag: Record<string, Endpoint[]> = {};
  endpoints.forEach(endpoint => {
    endpoint.tags.forEach(tag => {
      if (!endpointsByTag[tag]) endpointsByTag[tag] = [];
      endpointsByTag[tag].push(endpoint);
    });
  });

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'Payments': return <CreditCard className="h-4 w-4" />;
      case 'Transfers': return <Send className="h-4 w-4" />;
      case 'Countries':
      case 'Currencies':
      case 'Channels':
        return <Globe className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'PATCH': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleTag = (tag: string) => {
    setExpandedTags(prev => ({ ...prev, [tag]: !prev[tag] }));
  };

  const handleEndpointClick = (endpoint: Endpoint) => {
    onSelectEndpoint(endpoint);

    // Scroller vers ApiTester si la fonction est fournie
    if (onScrollToApiTester) {
      onScrollToApiTester();
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">API Endpoints</h3>

        <div className="space-y-2">
          {orderedTags.map(tag => {
            const tagEndpoints = endpointsByTag[tag] || [];
            if (tagEndpoints.length === 0) return null;

            const isExpanded = expandedTags[tag];

            return (
              <div key={tag} className="space-y-1">
                <button
                  onClick={() => toggleTag(tag)}
                  className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {getTagIcon(tag)}
                    <span className="font-medium text-sm">{tag}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {tagEndpoints.length}
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {tagEndpoints.map((endpoint, index) => {
                      const isSelected =
                        selectedEndpoint?.path === endpoint.path &&
                        selectedEndpoint?.method === endpoint.method;

                      return (
                        <button
                          key={`${endpoint.path}-${endpoint.method}-${index}`}
                          onClick={() => handleEndpointClick(endpoint)}
                          className={`flex items-center gap-2 w-full p-2 text-sm rounded-md text-left transition-colors ${isSelected
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <span className="truncate">{endpoint.summary}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info pour le scroll */}
        <div className="mt-8 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-xs text-blue-800">
            <span className="font-medium">Astuce :</span> Cliquez sur un endpoint pour tester directement l'API
          </p>
        </div>
      </div>
    </aside>
  );
}