'use client';

import { Endpoint } from '@/types/openapi';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Shield,
  CreditCard,
  Send,
  Database,
  Zap
} from 'lucide-react';

interface SidebarProps {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  onSelectEndpoint: (endpoint: Endpoint) => void;
}

export default function Sidebar({ endpoints, selectedEndpoint, onSelectEndpoint }: SidebarProps) {
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({
    'Health': true,
    'Authentication': true,
    'Payments': true,
    'Transfers': true,
    'Utilities': true,
  });

  // Grouper les endpoints par tag
  const endpointsByTag: Record<string, Endpoint[]> = {};

  endpoints.forEach(endpoint => {
    endpoint.tags.forEach(tag => {
      if (!endpointsByTag[tag]) {
        endpointsByTag[tag] = [];
      }
      endpointsByTag[tag].push(endpoint);
    });
  });

  // Tags dans l'ordre souhaité
  const orderedTags = ['Health', 'Authentication', 'Payments', 'Transfers', 'Utilities'];

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'Health': return <Zap className="h-4 w-4" />;
      case 'Authentication': return <Shield className="h-4 w-4" />;
      case 'Payments': return <CreditCard className="h-4 w-4" />;
      case 'Transfers': return <Send className="h-4 w-4" />;
      case 'Utilities': return <Globe className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleTag = (tag: string) => {
    setExpandedTags(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
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
                  className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {getTagIcon(tag)}
                    <span className="font-medium text-sm">{tag}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {tagEndpoints.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {tagEndpoints.map((endpoint, index) => {
                      const isSelected = selectedEndpoint?.path === endpoint.path &&
                        selectedEndpoint?.method === endpoint.method;

                      return (
                        <button
                          key={`${endpoint.path}-${endpoint.method}-${index}`}
                          onClick={() => onSelectEndpoint(endpoint)}
                          className={`flex items-center gap-2 w-full p-2 text-sm rounded-md text-left ${isSelected
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
      </div>
    </aside>
  );
}