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
  Send,
  CreditCard,
  DollarSign,
  ListChecks,
  Webhook,
  Wallet,
  Activity,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function Documentation() {
  const primaryColor = '#0b2635';

  const countries = [
    { id: '3927c8fe-937b-4633-9c08-fb60a7cde9b7', code: 'CF', name: 'Centrafrique', phone_prefix: '+236', currency: 'XAF' },
    { id: '464005b2-ede8-4c11-a0dc-afcc3500bd19', code: 'CG', name: 'Congo', phone_prefix: '+242', currency: 'XAF' },
    { id: 'c330321d-b01e-4de2-aac4-3c8402f04187', code: 'CI', name: "Côte d'Ivoire", phone_prefix: '+225', currency: 'XOF' },
    { id: 'c90a5ba5-7937-4012-b1e9-cbe3934e2d5b', code: 'GW', name: 'Guinée-Bissau', phone_prefix: '+245', currency: 'XOF' },
    { id: '584f2672-24fe-4574-876c-da1fe92dd4d8', code: 'ML', name: 'Mali', phone_prefix: '+223', currency: 'XOF' },
    { id: '79b05c73-d609-4663-8275-386a644e3b66', code: 'NE', name: 'Niger', phone_prefix: '+227', currency: 'XOF' },
    { id: '941cda0f-a193-4268-9af8-f2b80eb0282e', code: 'CD', name: 'RD Congo', phone_prefix: '+243', currency: 'XAF' },
    { id: '8904b4f3-b3ca-498c-b3ea-8b43e0b9df94', code: 'SN', name: 'Sénégal', phone_prefix: '+221', currency: 'XOF' },
  ];

  const currencies = [
    { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA', decimal_places: 0 },
    { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA', decimal_places: 0 },
  ];

  const channels = [
    { code: 'airtel_money', name: 'Airtel Money', type: 'mobile_money' },
    { code: 'flooz', name: 'Flooz', type: 'mobile_money' },
    { code: 'mpesa', name: 'M-Pesa', type: 'mobile_money' },
    { code: 'mastercard', name: 'Mastercard', type: 'card' },
    { code: 'moov_money', name: 'Moov Money', type: 'mobile_money' },
    { code: 'mtn_momo', name: 'MTN Mobile Money', type: 'mobile_money' },
    { code: 'orange_money', name: 'Orange Money', type: 'mobile_money' },
    { code: 'tmoney', name: 'T-Money', type: 'mobile_money' },
    { code: 'bank_transfer', name: 'Virement Bancaire', type: 'bank_transfer' },
    { code: 'instant_transfer', name: 'Virement Instantané', type: 'bank_transfer' },
    { code: 'visa', name: 'Visa', type: 'card' },
    { code: 'wave', name: 'Wave', type: 'mobile_money' },
  ];

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Bienvenue dans la documentation de l&apos;API FineoPay. Cette API vous permet d&apos;intégrer des solutions
            de paiement et de transfert d&apos;argent dans vos applications.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Ce que vous pouvez faire
            </h4>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Initier des paiements mobiles (OTP ou in-app)</span>
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
                <span>Configurer des webhooks pour les notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Consulter les soldes de vos comptes</span>
              </li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Base URL
            </h4>
            <p className="text-yellow-800 text-sm">
              Tous les endpoints sont accessibles via : <code className="bg-yellow-100 px-2 py-1 rounded">https://psp-api.fineopay.com/api/v1</code>
            </p>
          </div>
        </div>
      ),
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
              Toutes les requêtes à l&apos;API nécessitent une clé API valide. Cette clé doit être incluse dans
              l&apos;en-tête <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-API-Key</code>.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                {`// En-têtes requis pour toutes les requêtes
Headers: {
  "X-API-Key": "psp_key_live_xxxxxxxxxxxxxxxxxxxxxxxx",
  "x-environment": "sandbox" // ou "live"
  "Content-Type": "application/json" // pour les requêtes avec body
}`}
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Note :</strong> Le header <code className="bg-gray-100 px-1.5 py-0.5 rounded">x-environment</code> est obligatoire et doit être <code className="bg-gray-100 px-1.5 py-0.5 rounded">sandbox</code> ou <code className="bg-gray-100 px-1.5 py-0.5 rounded">live</code>.
            </p>
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
                <span>Générez une nouvelle clé API (sandbox ou live)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">4.</span>
                <span>Utilisez-la dans le header <code className="bg-gray-100 px-1.5 py-0.5 rounded">X-API-Key</code></span>
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'endpoints',
      title: 'Endpoints',
      icon: Code,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Paiements */}
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
                  <span>GET /payments/{'{transactionId}'}/status</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
              </ul>
            </div>

            {/* Transferts */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-purple-100">
                  <Send className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Transferts</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>POST /transfers/initiate</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /transfers</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /transfers/{'{transferId}'}/status</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Transactions */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-indigo-100">
                  <ListChecks className="h-5 w-5 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Transactions</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>GET /transactions</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /transactions/{'{transactionId}'}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
              </ul>
            </div>

            {/* Webhooks */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-orange-100">
                  <Webhook className="h-5 w-5 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Webhooks</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>POST /webhooks</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /webhooks</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /webhooks/{'{id}'}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>PATCH /webhooks/{'{id}'}</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">PATCH</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>DELETE /webhooks/{'{id}'}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">DELETE</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Balance */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-teal-100">
                  <Wallet className="h-5 w-5 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Balance</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>GET /balances</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
              </ul>
            </div>

            {/* Références */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-blue-100">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Références</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>GET /countries</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /channels</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GET /currencies</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0b2635] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded bg-gray-100">
                  <Activity className="h-5 w-5 text-gray-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Système</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>GET /health</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'references',
      title: 'Références',
      icon: Database,
      content: (
        <div className="space-y-6">
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
                    <div>
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{channel.code}</code>
                    </div>
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs ${channel.type === 'mobile_money'
                            ? 'bg-green-100 text-green-800'
                            : channel.type === 'card'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                      >
                        {channel.type === 'mobile_money'
                          ? 'Mobile Money'
                          : channel.type === 'card'
                            ? 'Carte bancaire'
                            : 'Virement bancaire'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'examples',
      title: 'Exemples',
      icon: FileText,
      content: (
        <div className="space-y-8">
          {/* NOTE IMPORTANTE SUR LES WEBHOOKS */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h5 className="font-semibold text-amber-800">⚠️ Important : Webhooks / callback_url</h5>
                <p className="text-sm text-amber-800">
                  Le <code className="bg-amber-100 px-1.5 py-0.5 rounded">callback_url</code> ne se met pas dans le body des requêtes.
                  Il se configure dans l&apos;espace marchand via l&apos;endpoint <strong>POST /webhooks</strong>.
                </p>
                <p className="text-sm text-amber-800">
                  Une fois configuré, FineoPay enverra automatiquement les notifications de statut à cette URL.
                </p>
              </div>
            </div>
          </div>

          {/* Paiements */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paiements
            </h4>

            <div className="space-y-6">
              {/* PAYMENT OTP */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2">
                  Initier un paiement - workflow OTP (POST /payments/initiate)
                </h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête - OTP
POST https://psp-api.fineopay.com/api/v1/payments/initiate
Headers: {
  "X-API-Key": "psp_key_sandbox_xxxxxxxxxxxxxxxxxxxxxxxx",
  "x-environment": "sandbox",
  "Content-Type": "application/json"
}
Body: {
  "merchantReference": "order-123456",
  "amount": 5000,
  "currency": "XOF",
  "channel": "orange_money",
  "country": "CI",
  "customer": {
    "phoneNumber": "+2250700000000",
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "description": "Payment for order #123456",
  "metadata": { "orderId": "123456" },
  "workflow": "otp",
  "otp": ""
}

// Réponse (201 Created)
{
  "success": true,
  "transactionId": "PM_MLGKNI5J_373C118B",
  "reference": "PM_MLGKNI5J_373C118B",
  "merchantReference": "order-123456",
  "status": "PENDING",
  "amount": 5000,
  "currency": "XOF",
  "environment": "sandbox",
  "partner": "SANDBOX",
  "partnerTransactionId": "SBX-PAY-1770726186952-88yknj",
  "validationData": [
    {
      "method": "link",
      "data": "https://psp-api.fineopay.com/sandbox/transactions/SBX-PAY-1770726186952-88yknj/validate"
    }
  ],
  "createdAt": "2026-02-25T10:30:00Z"
}`}
                  </pre>
                </div>
              </div>

              {/* PAYMENT IN_APP */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2">
                  Initier un paiement - workflow In-App (POST /payments/initiate)
                </h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête - In-App
POST https://psp-api.fineopay.com/api/v1/payments/initiate
Headers: {
  "X-API-Key": "psp_key_sandbox_xxxxxxxxxxxxxxxxxxxxxxxx",
  "x-environment": "sandbox",
  "Content-Type": "application/json"
}
Body: {
  "merchantReference": "order-123457",
  "amount": 7500,
  "currency": "XOF",
  "channel": "wave",
  "country": "SN",
  "customer": {
    "phoneNumber": "+221770000000",
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "description": "Payment for order #123457",
  "metadata": { "orderId": "123457" },
  "workflow": "in_app",
  "successRedirectUrl": "https://myapp.com/payment/success",
  "failedRedirectUrl": "https://myapp.com/payment/failed"
}`}
                  </pre>
                </div>
              </div>

              {/* LIST PAYMENTS */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Lister les paiements (GET /payments)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête avec filtres
GET https://psp-api.fineopay.com/api/v1/payments?page=1&limit=20&status=completed
Headers: {
  "X-API-Key": "psp_key_sandbox_xxxxxxxxxxxxxxxxxxxxxxxx",
  "x-environment": "sandbox"
}

// Réponse (200 OK)
{
  "success": true,
  "data": [
    {
      "transactionId": "PM_MLGKNI5J_373C118B",
      "merchantReference": "order-123456",
      "status": "completed",
      "amount": 5000,
      "currency": "XOF",
      "channel": "orange_money",
      "country": "CI",
      "customer": {
        "phoneNumber": "+2250700000000",
        "email": "customer@example.com",
        "name": "John Doe"
      },
      "createdAt": "2026-02-25T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "hasMore": true
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
                <h5 className="font-medium text-gray-700 mb-2">Initier un transfert (POST /transfers/initiate)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête
POST https://psp-api.fineopay.com/api/v1/transfers/initiate
Headers: {
  "X-API-Key": "psp_key_sandbox_xxxxxxxxxxxxxxxxxxxxxxxx",
  "x-environment": "sandbox",
  "Content-Type": "application/json"
}
Body: {
  "merchantReference": "transfer-123456",
  "amount": 25000,
  "currency": "XOF",
  "channel": "mtn_momo",
  "country": "CI",
  "recipient": {
    "phoneNumber": "+2250700000001",
    "name": "Jane Doe"
  },
  "description": "Payout for invoice #789",
  "metadata": {
    "invoiceId": "789"
  }
}

// Réponse (201 Created)
{
  "success": true,
  "data": {
    "transferId": "TR_MLGKNI5J_373C118C",
    "merchantReference": "transfer-123456",
    "status": "PENDING",
    "amount": 25000,
    "currency": "XOF",
    "channel": "mtn_momo",
    "country": "CI",
    "recipient": {
      "phoneNumber": "+2250700000001",
      "name": "Jane Doe"
    },
    "createdAt": "2026-02-25T10:35:00Z"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Webhooks */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </h4>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Créer un webhook (POST /webhooks)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête - Création d'un webhook
POST https://psp-api.fineopay.com/api/v1/webhooks
Headers: {
  "X-API-Key": "psp_key_sandbox_xxxxxxxxxxxxxxxxxxxxxxxx",
  "x-environment": "sandbox",
  "Content-Type": "application/json"
}
Body: {
  "name": "Payment Notifications",
  "webhookUrl": "https://myapp.com/webhooks/payments",
  "eventTypes": ["payment.completed", "payment.failed"],
  "transactionTypes": ["payment", "transfer"],
  "isActive": true,
  "maxRetries": 6,
  "timeoutSeconds": 30
}

// Réponse (201 Created)
{
  "success": true,
  "data": {
    "id": "wh_123456789",
    "name": "Payment Notifications",
    "webhookUrl": "https://myapp.com/webhooks/payments",
    "eventTypes": ["payment.completed", "payment.failed"],
    "transactionTypes": ["payment", "transfer"],
    "isActive": true,
    "maxRetries": 6,
    "timeoutSeconds": 30,
    "createdAt": "2026-02-25T10:40:00Z"
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Exemple de payload reçu</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Webhook reçu sur votre serveur
{
  "event": "payment.completed",
  "transactionId": "PM_MLGKNI5J_373C118B",
  "merchantReference": "order-123456",
  "status": "completed",
  "amount": 5000,
  "currency": "XOF",
  "customerPhone": "+2250700000000",
  "timestamp": "2026-02-25T10:32:00Z",
  "signature": "sha256=7d3f9b8c2a1e5f6d8c7b9a0e3f4d5c6b7a8e9f0d1c2b3a4e5f6d7c8b9a0e1f2d3c4b"
}

// Événements possibles
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
          </div>

          {/* Balance */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Balance
            </h4>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Consulter les soldes (GET /balances)</h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// Requête
GET https://psp-api.fineopay.com/api/v1/balances
Headers: {
  "X-API-Key": "psp_key_sandbox_xxxxxxxxxxxxxxxxxxxxxxxx",
  "x-environment": "sandbox"
}

// Réponse (200 OK)
{
  "success": true,
  "data": [
    {
      "currency": "XOF",
      "available": 1500000,
      "ledger": 1500000,
      "accountId": "acc_123456789",
      "updatedAt": "2026-02-25T10:00:00Z"
    },
    {
      "currency": "XAF",
      "available": 750000,
      "ledger": 750000,
      "accountId": "acc_123456789",
      "updatedAt": "2026-02-25T10:00:00Z"
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'error-codes',
      title: "Codes d'erreur",
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Codes HTTP courants</h4>
            <div className="space-y-3">
              {[
                { code: '400', title: 'Bad Request', desc: 'Requête mal formée ou données invalides' },
                { code: '401', title: 'Unauthorized', desc: 'Clé API invalide, manquante ou expirée' },
                { code: '403', title: 'Forbidden', desc: 'Permissions insuffisantes pour la ressource' },
                { code: '404', title: 'Not Found', desc: 'Ressource non trouvée' },
                { code: '422', title: 'Unprocessable Entity', desc: 'Données valides mais non traitables' },
                { code: '429', title: 'Too Many Requests', desc: 'Limite de requêtes dépassée' },
                { code: '500', title: 'Internal Server Error', desc: 'Erreur interne du serveur' },
              ].map((item) => (
                <div key={item.code} className="flex items-start gap-3 p-3 bg-white rounded border">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">{item.code}</span>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Messages d&apos;erreur spécifiques</h4>
            <ul className="space-y-2 text-blue-700 text-sm">
              {[
                { code: 'INVALID_API_KEY', text: 'La clé API fournie est invalide' },
                { code: 'INSUFFICIENT_FUNDS', text: 'Solde insuffisant pour le transfert' },
                { code: 'TRANSACTION_LIMIT_EXCEEDED', text: 'Limite de montant dépassée' },
                { code: 'CHANNEL_UNAVAILABLE', text: 'Canal de paiement non disponible' },
                { code: 'DUPLICATE_TRANSACTION_ID', text: 'ID de transaction déjà utilisé' },
                { code: 'INVALID_PHONE_NUMBER', text: 'Numéro de téléphone invalide' },
                { code: 'UNSUPPORTED_CURRENCY', text: 'Devise non supportée pour ce pays' },
                { code: 'MISSING_ENVIRONMENT_HEADER', text: 'Header x-environment requis (sandbox ou live)' },
                { code: 'WORKFLOW_REQUIRED', text: 'workflow=otp ou in_app requis pour /payments/initiate' },
              ].map((item) => (
                <li key={item.code} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <code className="bg-blue-100 px-1.5 py-0.5 rounded">{item.code}</code> - {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
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
                  Votre clé API est comme un mot de passe. Ne la partagez jamais publiquement, ne la commitez pas dans
                  votre code source et ne l&apos;exposez pas côté client.
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
                <p className="text-gray-700 text-sm">Les URLs de paiement générées expirent automatiquement après 24 heures.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-[#0b2635] mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-gray-800">Validation des données</h5>
                <p className="text-gray-700 text-sm">Toutes les données sont validées côté serveur avant traitement.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Key className="h-5 w-5 text-[#0b2635] mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-gray-800">Headers requis</h5>
                <p className="text-gray-700 text-sm">
                  Chaque requête doit inclure <code className="bg-gray-100 px-1.5 py-0.5 rounded">X-API-Key</code> et{' '}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">x-environment</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
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
              {[
                'Toujours utiliser des IDs de transaction uniques (merchantReference)',
                'Implémenter les webhooks pour les mises à jour de statut',
                'Valider les montants et devises avant envoi',
                "Tester d'abord en environnement sandbox",
                'Conserver les IDs de transaction pour le suivi',
                'Gérer proprement les erreurs et les timeouts',
                'Vérifier la signature des webhooks pour la sécurité',
                'Utiliser des clés API différentes pour sandbox et production',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Gestion des webhooks</h4>
            <p className="text-gray-700 mb-3">
              Configurez des webhooks dans votre espace marchand pour recevoir des notifications en temps réel sur le statut de vos transactions.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                {`// Exemple de vérification de signature (Node.js)
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const calculated = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(\`sha256=\${calculated}\`)
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-white p-2 rounded-lg" style={{ backgroundColor: primaryColor }}>
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

            <Link href="/documentation" className="flex items-center gap-2 font-medium" style={{ color: primaryColor }}>
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
          {/* Sidebar */}
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

          {/* Sections */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-8 bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
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
              Utilisez notre testeur d&apos;API pour expérimenter avec les endpoints en temps réel avant de les intégrer
              dans votre application.
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