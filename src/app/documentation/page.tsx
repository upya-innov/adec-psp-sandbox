'use client';

import {
  BookOpen,
  Code,
  Key,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Cpu,
  Database,
  Lock,
  Users,
  BarChart,
  Send,
  CreditCard,
  DollarSign,
  MapPin,
  Wifi
} from 'lucide-react';
import Link from 'next/link';

export default function Documentation() {
  const primaryColor = '#0b2635';
  const secondaryColor = '#1a365d';

  const countries = [
    { id: "3927c8fe-937b-4633-9c08-fb60a7cde9b7", code: "CF", name: "Centrafrique", phone_prefix: "+236", currency: "XAF" },
    { id: "464005b2-ede8-4c11-a0dc-afcc3500bd19", code: "CG", name: "Congo", phone_prefix: "+242", currency: "XAF" },
    { id: "c330321d-b01e-4de2-aac4-3c8402f04187", code: "CI", name: "Côte d'Ivoire", phone_prefix: "+225", currency: "XOF" },
    { id: "c90a5ba5-7937-4012-b1e9-cbe3934e2d5b", code: "GW", name: "Guinée-Bissau", phone_prefix: "+245", currency: "XOF" },
    { id: "584f2672-24fe-4574-876c-da1fe92dd4d8", code: "ML", name: "Mali", phone_prefix: "+223", currency: "XOF" },
    { id: "79b05c73-d609-4663-8275-386a644e3b66", code: "NE", name: "Niger", phone_prefix: "+227", currency: "XOF" },
    { id: "941cda0f-a193-4268-9af8-f2b80eb0282e", code: "CD", name: "RD Congo", phone_prefix: "+243", currency: "XAF" },
    { id: "8904b4f3-b3ca-498c-b3ea-8b43e0b9df94", code: "SN", name: "Sénégal", phone_prefix: "+221", currency: "XOF" }
  ];

  const currencies = [
    { code: "XOF", name: "Franc CFA (BCEAO)", symbol: "CFA", decimal_places: 0 },
    { code: "XAF", name: "Franc CFA (BEAC)", symbol: "FCFA", decimal_places: 0 }
  ];

  const channels = [
    { code: "airtel_money", name: "Airtel Money", type: "mobile_money" },
    { code: "flooz", name: "Flooz", type: "mobile_money" },
    { code: "mpesa", name: "M-Pesa", type: "mobile_money" },
    { code: "mastercard", name: "Mastercard", type: "card" },
    { code: "moov_money", name: "Moov Money", type: "mobile_money" },
    { code: "mtn_momo", name: "MTN Mobile Money", type: "mobile_money" },
    { code: "orange_money", name: "Orange Money", type: "mobile_money" },
    { code: "tmoney", name: "T-Money", type: "mobile_money" },
    { code: "bank_transfer", name: "Virement Bancaire", type: "bank_transfer" },
    { code: "instant_transfer", name: "Virement Instantané", type: "bank_transfer" },
    { code: "visa", name: "Visa", type: "card" },
    { code: "wave", name: "Wave", type: "mobile_money" }
  ];

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Bienvenue dans la documentation de l&apos;API FineoPay. Cette API vous permet d&apos;intégrer
            des solutions de paiement et de transfert d&apos;argent dans vos applications.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Ce que vous pouvez faire
            </h4>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Initier des paiements mobiles</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Effectuer des transferts d&apos;argent</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Consulter l&apos;historique des transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Gérer les annulations et remboursements</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentification',
      icon: Key,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Clé API</h4>
            <p className="text-gray-700 mb-3">
              Toutes les requêtes à l&apos;API nécessitent une clé API valide. Cette clé doit être
              incluse dans l&apos;en-tête <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-API-Key</code>.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                {`// Exemple d'en-tête
{
  "X-API-Key": "psp_key_xxxxxxxxxxxxxxxxxxxxxxxx",
  "Content-Type": "application/json"
}`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Où obtenir votre clé API</h4>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-semibold">1.</span>
                <span>Connectez-vous à votre espace client FineoPay</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">2.</span>
                <span>Accédez à la section &quot;Développeurs&quot; ou &quot;API&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">3.</span>
                <span>Générez une nouvelle clé API ou utilisez une clé existante</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">4.</span>
                <span>Copiez-la dans le testeur d&apos;API pour commencer</span>
              </li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'endpoints',
      title: 'Endpoints',
      icon: Code,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-green-100">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Paiements</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>POST /payments/initiate</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /payments</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /payments/{'{transactionId}'}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>PATCH /payments/{'{transactionId}'}/cancel</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">PATCH</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-purple-100">
                  <Send className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Transferts</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>POST /transfers/api-key</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /transfers</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /transfers/{'{transferId}'}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>PATCH /transfers/{'{transferId}'}/cancel</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">PATCH</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-blue-100">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Pays & Références</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>GET /countries</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /countries/{'{id}'}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /channels</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /channels/{'{id}'}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /currencies</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /currencies/{'{id}'}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
              </ul>
            </div>

            {/*    <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-red-100">
                  <Wifi className="h-5 w-5 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Système</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>GET /health</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">GET</span>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      )
    },
    {
      id: 'references',
      title: 'Références',
      icon: Database,
      content: (
        <div className="space-y-6">
          {/* Pays */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Pays supportés
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-50 border-b p-3 text-sm font-semibold text-gray-700">
                <div>Code</div>
                <div>Nom</div>
                <div>Indicatif</div>
                <div>Devise</div>
              </div>
              <div className="divide-y">
                {countries.map((country) => (
                  <div key={country.id} className="grid grid-cols-4 p-3 text-sm text-gray-600 hover:bg-gray-50">
                    <div className="font-medium">{country.code}</div>
                    <div>{country.name}</div>
                    <div>{country.phone_prefix}</div>
                    <div>{country.currency}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Devises */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Devises supportées
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-50 border-b p-3 text-sm font-semibold text-gray-700">
                <div>Code</div>
                <div>Nom</div>
                <div>Symbole</div>
                <div>Décimales</div>
              </div>
              <div className="divide-y">
                {currencies.map((currency) => (
                  <div key={currency.code} className="grid grid-cols-4 p-3 text-sm text-gray-600 hover:bg-gray-50">
                    <div className="font-medium">{currency.code}</div>
                    <div>{currency.name}</div>
                    <div>{currency.symbol}</div>
                    <div>{currency.decimal_places}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canaux */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Canaux de paiement
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-50 border-b p-3 text-sm font-semibold text-gray-700">
                <div>Nom</div>
                <div>Code API</div>
                <div>Type</div>
              </div>
              <div className="divide-y">
                {channels.map((channel) => (
                  <div key={channel.code} className="grid grid-cols-3 p-3 text-sm text-gray-600 hover:bg-gray-50">
                    <div className="font-medium">{channel.name}</div>
                    <div><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{channel.code}</code></div>
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${channel.type === 'mobile_money' ? 'bg-green-100 text-green-800' :
                        channel.type === 'card' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                        {channel.type === 'mobile_money' ? 'Mobile Money' :
                          channel.type === 'card' ? 'Carte bancaire' :
                            'Virement bancaire'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'examples',
      title: 'Exemples',
      icon: FileText,
      content: (
        <div className="space-y-8">
          {/* Paiements */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paiements
            </h4>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Initier un paiement (POST /payments/initiate)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête - Exemple pour la Côte d'Ivoire avec Orange Money
POST https://psp-api.fineopay.com/payments/initiate
Headers: {
  "X-API-Key": "psp_key_xxxxxxxxxxxxxxxxxxxxxxxx",
  "Content-Type": "application/json"
}
Body: {
  "transaction_id": "TX-1705234567890",
  "amount": 1000,
  "currency": "XOF",
  "country": "CI",
  "channel": "orange_money",
  "customer": {
    "phone_number": "2250700000000",
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "description": "Payment for order #12345",
  "metadata": {
    "order_id": "12345",
    "product": "Premium Subscription"
  },
  "callback_url": "https://webhook.example.com/payments"
}

// Réponse (201 Created)
{
  "transaction_id": "TX-1705234567890",
  "status": "pending",
  "amount": 1000,
  "currency": "XOF",
  "payment_url": "https://psp-api.fineopay.com/pay/TX-1705234567890",
  "expires_at": "2024-01-01T12:00:00Z",
  "created_at": "2024-01-01T11:00:00Z"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Query les paiements (GET /payments)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête avec filtres
GET https://psp-api.fineopay.com/payments?status=completed&limit=10&offset=0&start_date=2024-01-01&end_date=2024-01-31
Headers: {
  "X-API-Key": "psp_key_xxxxxxxxxxxxxxxxxxxxxxxx"
}

// Réponse (200 OK)
{
  "success": true,
  "data": [
    {
      "transaction_id": "TX-1705234567890",
      "amount": 1000,
      "currency": "XOF",
      "status": "completed",
      "created_at": "2024-01-01T11:00:00Z",
      "customer": {
        "phone_number": "2250700000000",
        "email": "customer@example.com",
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Annuler un paiement (PATCH /payments/{'{transactionId}'}/cancel)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête
PATCH https://psp-api.fineopay.com/payments/TX-1705234567890/cancel
Headers: {
  "X-API-Key": "psp_key_xxxxxxxxxxxxxxxxxxxxxxxx",
  "Content-Type": "application/json"
}
Body: {
  "reason": "Customer requested cancellation"
}

// Réponse (200 OK)
{
  "success": true,
  "data": {
    "transaction_id": "TX-1705234567890",
    "status": "cancelled",
    "cancelled_at": "2024-01-01T11:30:00Z",
    "cancellation_reason": "Customer requested cancellation"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Transferts */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Send className="h-5 w-5" />
              Transferts
            </h4>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Initier un transfert (POST /transfers/api-key)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête - Exemple pour le Sénégal avec Wave
POST https://psp-api.fineopay.com/transfers/api-key
Headers: {
  "X-API-Key": "psp_key_xxxxxxxxxxxxxxxxxxxxxxxx",
  "Content-Type": "application/json"
}
Body: {
  "transfer_id": "TR-1705234567891",
  "amount": 2500,
  "currency": "XOF",
  "country": "SN",
  "channel": "wave",
  "recipient": {
    "phone_number": "221770000000",
    "name": "Alice Johnson"
  },
  "description": "Payout for service rendered",
  "metadata": {
    "payout_reason": "freelance_payment",
    "contract_id": "CON-789"
  },
  "callback_url": "https://webhook.example.com/transfers"
}

// Réponse (201 Created)
{
  "success": true,
  "data": {
    "transfer_id": "TR-1705234567891",
    "status": "pending",
    "amount": 2500,
    "currency": "XOF",
    "estimated_completion": "2024-01-01T12:30:00Z",
    "created_at": "2024-01-01T11:00:00Z"
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Query les transferts (GET /transfers)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête avec filtres
GET https://psp-api.fineopay.com/transfers?status=completed&limit=10&offset=0&recipient_phone=221770000000
Headers: {
  "X-API-Key": "psp_key_xxxxxxxxxxxxxxxxxxxxxxxx"
}

// Réponse (200 OK)
{
  "success": true,
  "data": [
    {
      "transfer_id": "TR-1705234567891",
      "amount": 2500,
      "currency": "XOF",
      "status": "completed",
      "created_at": "2024-01-01T11:00:00Z",
      "recipient": {
        "phone_number": "221770000000",
        "name": "Alice Johnson"
      }
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Références */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Données de Référence
            </h4>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Liste des pays (GET /countries)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête
GET https://psp-api.fineopay.com/countries

// Réponse (200 OK)
{
  "success": true,
  "data": ${JSON.stringify(countries.slice(0, 3), null, 2)},
  "meta": {
    "timestamp": "2024-01-01T11:00:00Z",
    "correlationId": "34ea3a49-0f4e-46b9-97b4-479ccb775aea"
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Liste des canaux (GET /channels)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête
GET https://psp-api.fineopay.com/channels

// Réponse (200 OK)
{
  "success": true,
  "data": ${JSON.stringify(channels.slice(0, 3), null, 2)},
  "meta": {
    "timestamp": "2024-01-01T11:00:00Z",
    "correlationId": "6a2c2196-438d-4a3e-b963-bfb1d82ff299"
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Liste des devises (GET /currencies)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête
GET https://psp-api.fineopay.com/currencies

// Réponse (200 OK)
{
  "success": true,
  "data": ${JSON.stringify(currencies, null, 2)},
  "meta": {
    "timestamp": "2024-01-01T11:00:00Z",
    "correlationId": "7a98f393-18be-4d74-8425-503405cf451d"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'error-codes',
      title: 'Codes d\'erreur',
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Codes HTTP courants</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded border">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">400</span>
                <div>
                  <p className="font-medium text-gray-800">Bad Request</p>
                  <p className="text-sm text-gray-600">Requête mal formée ou données invalides</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded border">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">401</span>
                <div>
                  <p className="font-medium text-gray-800">Unauthorized</p>
                  <p className="text-sm text-gray-600">Clé API invalide, manquante ou expirée</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded border">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">403</span>
                <div>
                  <p className="font-medium text-gray-800">Forbidden</p>
                  <p className="text-sm text-gray-600">Permissions insuffisantes pour la ressource</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded border">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">404</span>
                <div>
                  <p className="font-medium text-gray-800">Not Found</p>
                  <p className="text-sm text-gray-600">Ressource non trouvée</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded border">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">422</span>
                <div>
                  <p className="font-medium text-gray-800">Unprocessable Entity</p>
                  <p className="text-sm text-gray-600">Données valides mais non traitables</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded border">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">429</span>
                <div>
                  <p className="font-medium text-gray-800">Too Many Requests</p>
                  <p className="text-sm text-gray-600">Limite de requêtes dépassée</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded border">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">500</span>
                <div>
                  <p className="font-medium text-gray-800">Internal Server Error</p>
                  <p className="text-sm text-gray-600">Erreur interne du serveur</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Messages d&apos;erreur spécifiques</h4>
            <ul className="space-y-2 text-blue-700 text-sm">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><code>INVALID_API_KEY</code> - La clé API fournie est invalide</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><code>INSUFFICIENT_FUNDS</code> - Solde insuffisant pour le transfert</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><code>TRANSACTION_LIMIT_EXCEEDED</code> - Limite de montant dépassée</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><code>CHANNEL_UNAVAILABLE</code> - Canal de paiement non disponible</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><code>DUPLICATE_TRANSACTION_ID</code> - ID de transaction déjà utilisé</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><code>INVALID_PHONE_NUMBER</code> - Numéro de téléphone invalide</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><code>UNSUPPORTED_CURRENCY</code> - Devise non supportée pour ce pays</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">⚠️ Sécurité de votre clé API</h4>
                <p className="text-red-700 text-sm">
                  Votre clé API est comme un mot de passe. Ne la partagez jamais publiquement,
                  ne la commitez pas dans votre code source et ne l&apos;exposez pas côté client.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Lock className="h-5 w-5 text-[#0b2635] mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-gray-800">HTTPS Obligatoire</h5>
                <p className="text-gray-700 text-sm">
                  Toutes les requêtes doivent utiliser HTTPS. Les requêtes HTTP seront automatiquement rejetées.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-[#0b2635] mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-gray-800">Tokens à durée limitée</h5>
                <p className="text-gray-700 text-sm">
                  Les URLs de paiement générées expirent automatiquement après 24 heures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-[#0b2635] mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-gray-800">Validation des données</h5>
                <p className="text-gray-700 text-sm">
                  Toutes les données sont validées côté serveur avant traitement.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Bonnes pratiques',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🎯 Meilleures pratiques de développement</h4>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Toujours utiliser des IDs de transaction uniques</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Implémenter les webhooks pour les mises à jour de statut</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Valider les montants et devises avant envoi</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Tester d&apos;abord en environnement sandbox</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Conserver les IDs de transaction pour le suivi</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Gérer proprement les erreurs et les timeouts</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Gestion des webhooks</h4>
            <p className="text-gray-700 mb-3">
              Configurez des webhooks pour recevoir des notifications en temps réel sur le statut de vos transactions.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                {`// Exemple de payload webhook
{
  "event": "payment.completed",
  "transaction_id": "TX-1705234567890",
  "status": "completed",
  "amount": 1000,
  "currency": "XOF",
  "customer_phone": "2250700000000",
  "timestamp": "2024-01-01T11:30:00Z",
  "signature": "sha256=..."
}

// Événements disponibles
- payment.initiated
- payment.completed
- payment.failed
- payment.cancelled
- transfer.initiated
- transfer.completed
- transfer.failed
- transfer.cancelled`}
              </pre>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="text-white p-2 rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Documentation API</h1>
              <p className="text-sm text-gray-600">Guide complet pour l&apos;intégration de l&apos;API FineoPay</p>
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
              className="flex items-center gap-2 text-[#0b2635] font-medium"
              style={{ color: primaryColor }}
            >
              <BookOpen className="h-5 w-5" />
              <span>Documentation</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation rapide */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guide d&apos;intégration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] hover:shadow-sm transition-all text-center"
              >
                <div className="mb-2">
                  <section.icon className="h-6 w-6 mx-auto" style={{ color: primaryColor }} />
                </div>
                <span className="text-xs font-medium text-gray-800">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Navigation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#0b2635] py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <section.icon className="h-4 w-4" />
                    <span>{section.title}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#0b2635] text-white rounded-md hover:opacity-90 transition-opacity font-medium"
                >
                  <ArrowRight className="h-4 w-4" />
                  Tester l&apos;API
                </Link>
              </div>
            </div>
          </div>

          {/* Contenu des sections */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8 bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  >
                    <section.icon className="h-6 w-6" style={{ color: primaryColor }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                </div>
                {section.content}
              </section>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Prêt à intégrer ?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Utilisez notre testeur d&apos;API pour expérimenter avec les endpoints en temps réel
              avant de les intégrer dans votre application.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 py-3 px-6 bg-[#0b2635] text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-lg"
            >
              <Code className="h-5 w-5" />
              Accéder au testeur d&apos;API
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">FineoPay API</span>
              </div>
              <p className="text-sm">Plateforme de paiement sécurisée et moderne</p>
            </div>
            <div className="text-sm">
              <p>© {new Date().getFullYear()} FineoPay. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}