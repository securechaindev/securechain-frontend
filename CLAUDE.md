# CLAUDE.md - SecureChain Frontend Project Context

> **⚠️ IMPORTANT GUIDELINES FOR THIS FILE:**
>
> - **Maximum length:** 500 lines
> - **Include only relevant context** for current development needs
> - **Remove outdated or unused sections** regularly
> - **Focus on active features** and commonly referenced information

---

## 📋 General Project Information

**Name:** SecureChain Frontend  
**Version:** 1.1.0  
**Description:** User interface for Secure Chain's open-source cybersecurity tools  
**Repository:** https://github.com/securechaindev/securechain-frontend  
**License:** GNU General Public License 3.0  
**Team:** Secure Chain Team (hi@securechain.dev)  
**Documentation:** https://securechaindev.github.io/

---

## 🏗️ Technology Stack

### Core

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Programming language
- **Node.js 18.19.1+** - Minimum required runtime

### UI and Styling

- **Tailwind CSS 3.4.17** - CSS utility framework
- **Radix UI** - Accessible unstyled components
- **shadcn/ui** - Component library built on Radix
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **next-themes** - Theme system (light/dark/system)

### Internationalization

- **i18next** + **react-i18next** + **next-i18next**
- Supported languages: **English (en)** and **Spanish (es)**

### Forms and Validation

- **React Hook Form 7.54.1** - Form management
- **Zod 3.24.1** - Schema validation
- **@hookform/resolvers** - Resolvers for RHF

### Data and State

- **React Context API** - State management (PackageContext, AuthProvider, ThemeProvider)
- Custom hooks in `/hooks` for reusable logic
- Custom API client in `/lib/api`

### Visualization

- **Recharts 2.15.0** - Charts and data visualization
- **force-graph** - Interactive graph visualization (for dependency graphs)

---

## 📁 Project Structure

```
securechain-frontend/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Root page (redirects)
│   └── [locale]/                # Localized routes (en/es)
│       ├── layout.tsx           # Layout with locale
│       ├── loading.tsx          # Loading state
│       ├── page.tsx             # Main page per locale
│       ├── docs/                # Documentation
│       ├── home/                # Main dashboard
│       └── login/               # Authentication
│
├── components/                   # React components
│   ├── common/                  # Common components (TryButton)
│   ├── feature/                 # Specific features
│   │   ├── auth/               # Authentication components
│   │   ├── depex/              # Dependency Explorer
│   │   ├── diagrams/           # Visualizations
│   │   ├── docs/               # Documentation
│   │   ├── home/               # Dashboard
│   │   └── vexgen/             # VEX generation
│   ├── layout/                  # Layout components
│   │   ├── LanguageToggle.tsx  # Language selector
│   │   └── ThemeToggle.tsx     # Theme selector
│   ├── providers/               # Context Providers
│   │   ├── AuthProvider.tsx    # Auth provider
│   │   └── ThemeProvider.tsx   # Theme provider
│   └── ui/                      # Design system (shadcn/ui)
│       ├── Button.tsx
│       ├── Dialog.tsx
│       ├── Form.tsx
│       ├── Input.tsx
│       ├── Table.tsx
│       └── ... (40+ components)
│
├── constants/                    # Application constants
│   ├── apiEndpoints.ts          # Endpoint URLs
│   └── appConstants.ts          # General constants
│
├── context/                      # React Contexts
│   └── PackageContext.tsx       # Package state
│
├── hooks/                        # Custom React Hooks
│   ├── api/                     # API hooks
│   │   ├── useAuthenticatedApi.ts
│   │   ├── usePackageInfo.ts
│   │   ├── usePackageOperations.ts
│   │   ├── useRepositories.ts
│   │   ├── useRequirementOperations.ts
│   │   ├── useTIXOperations.ts
│   │   ├── useVersionInfo.ts
│   │   ├── useVEXOperations.ts
│   │   └── useVEXTIXGeneneration.ts
│   ├── auth/                    # Authentication hooks
│   │   ├── useAuth.ts
│   │   ├── useAuthState.ts
│   │   └── useHomeAuth.ts
│   ├── ui/                      # UI hooks
│   │   ├── useMobile.tsx
│   │   └── useToast.ts
│   └── utils/                   # Utility hooks
│       └── useLocalization.ts
│
├── lib/                          # Utilities and configuration
│   ├── api/                     # API client
│   │   └── apiClient.ts        # HTTP client
│   ├── auth/                    # Authentication logic
│   │   ├── auth.ts
│   │   └── authErrorHandler.ts
│   ├── config/                  # Configuration
│   │   ├── config.ts           # Config singleton
│   │   ├── clientConfig.ts
│   │   └── serverConfig.ts
│   ├── i18n/                    # i18n configuration
│   │   └── i18n.ts
│   ├── utils/                   # Utilities
│   │   ├── core.ts
│   │   ├── endpointData.ts
│   │   ├── endpointUtils.ts
│   │   ├── errorDetails.ts
│   │   ├── errorHandler.ts
│   │   ├── errors.ts
│   │   └── schemas.ts
│   └── validation/              # Validations
│       └── validation.ts
│
├── types/                        # TypeScript definitions
│   ├── Auth.ts
│   ├── Package.ts
│   ├── PackageInfo.ts
│   ├── Repository.ts
│   ├── RequirementOperations.ts
│   ├── Schema.ts
│   ├── TIX.ts
│   ├── VersionInfo.ts
│   ├── VEX.ts
│   └── VEXTIX.ts
│
├── public/                       # Static files
│   ├── assets/
│   ├── images/
│   └── locales/                 # JSON translations
│       ├── en/
│       └── es/
│
├── middleware.ts                 # Next.js middleware
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind configuration
├── components.json              # shadcn/ui configuration
├── Dockerfile                   # Docker image
├── nginx.conf.template          # NGINX configuration
└── package.json                 # Dependencies
```

---

## 🔐 Authentication and Security

### Authentication System

- **JWT-based** with access_token and refresh_token
- **HTTP-Only Cookies** for storing tokens securely
- **Middleware** for automatic token refresh
- **Token validation** against backend

### Authentication Flow

1. Login → Backend issues access_token + refresh_token
2. Tokens stored in httpOnly cookies
3. Middleware verifies tokens on each request
4. If access_token expires → auto-refresh with refresh_token
5. If refresh fails → redirect to login

### Required Environment Variables

```bash
# Backend URLs
NEXT_PUBLIC_API_URL=http://localhost:8000      # Backend API
NEXT_PUBLIC_APP_URL=http://localhost:3000      # Frontend URL
BACKEND_URL=http://localhost:8000              # For middleware

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## 🌐 Internationalization (i18n)

### Configuration

- **Supported locales:** `en` (English), `es` (Spanish)
- **Default locale:** `en`
- **Route structure:** `/{locale}/route` (example: `/en/home`, `/es/login`)
- **Translations:** In `public/locales/{locale}/*.json`

### Locale Detection

1. URL pathname (if includes `/en/` or `/es/`)
2. `Accept-Language` header
3. Fallback to `en`

### Usage in Components

```typescript
import { useLocalization } from '@/hooks/utils/useLocalization'

function MyComponent() {
  const { t } = useLocalization()
  return <h1>{t('welcome')}</h1>
}
```

---

## 🎨 Design System

- **shadcn/ui** components in `/components/ui` (built on Radix UI)
- **Themes:** Light, Dark, System (detects OS preference)
- Toggle via `<ThemeToggle />`, stored in localStorage
- **Color variables** in `tailwind.config.ts`: `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--destructive`, `--muted`, `--border`

---

## 🔌 Backend Integration

- **API Client:** `/lib/api/apiClient.ts` (fetch-based with interceptors)
- **API Hooks:** `/hooks/api/` - useAuthenticatedApi, usePackageInfo, usePackageOperations, useRepositories, useVersionInfo, useVEXOperations, useTIXOperations
- **Endpoints:** Defined in `/constants/apiEndpoints.ts`
- **Timeout:** 30s | **Retry logic** included

---

## 🏠 Main Features

1. **Dependency Explorer (DepEx)** - Visual dependency graph with vulnerability analysis (PyPI, NPM, Maven, RubyGems, Cargo, NuGet)
2. **VEX Generation** - Vulnerability Exploitability eXchange documentation and export
3. **TIX** - Threat Intelligence Exchange integration
4. **Repository Management** - Git repository analysis
5. **Package Analysis** - Detailed package info, version history, vulnerability detection

---

## 🗄️ State Management

- **PackageContext** - Global package state
- **AuthProvider** - Authentication state
- **ThemeProvider** - Theme state
- **Local Storage Keys:** `user_email`, `theme`, `locale`, `home-active-tab`

---

## 🚀 Next.js Configuration

```javascript
{
  output: 'export',              // Static export
  trailingSlash: true,           // URLs with trailing slash
  images: { unoptimized: true }, // No image optimization
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
}
```

- **App Router** (Next.js 13+) with Server Components by default
- Client Components require `'use client'` directive

---

## 🐳 Docker and Deployment

```bash
# Development
docker compose -f dev/docker-compose.yml up --build
# OR: pnpm install && pnpm dev

# Production
pnpm build && pnpm start
```

**Docker Network:** `securechain` (connects frontend, backend, databases)

---

## 📦 Package Management

**Package Manager:** pnpm

```bash
pnpm dev           # Development (port 3000)
pnpm build         # Production build
pnpm start         # Production server
pnpm lint          # ESLint
pnpm format        # Prettier
pnpm type-check    # TypeScript check
```

---

## 🧪 Testing and Quality

- **ESLint** with TypeScript and Next.js integration
- **Prettier** for code formatting
- **TypeScript** strict type checking

---

## 🔍 Package Node Types & Vulnerability Severity

**Node Types:** `PyPIPackage`, `NPMPackage`, `MavenPackage`, `RubyGemsPackage`, `CargoPackage`, `NuGetPackage`

**Severity:** `critical`, `high`, `medium`, `low`, `info`

---

## 📝 Code Conventions

- **TypeScript:** Strict mode, interfaces over types, named exports, path alias `@/`
- **React:** Functional components with hooks, `'use client'` for client components, props with TypeScript interfaces
- **Styling:** Tailwind utility-first, `cn()` helper for class merging, CVA for component variants
- **Files:** `index.ts` for exports, co-location of related files, PascalCase for components, camelCase for hooks/utils

---

## 📊 Graph API Specification

### Overview

The backend exposes **two separate endpoints** for graph expansion:

1. **Expand Package** (`POST /api/depex/graph/expand/package`)
   - Returns all versions of a package
   - Request: `{ node_type: string, package_purl: string }`
   - Response: Version nodes with HAVE edges

2. **Expand Version** (`POST /api/depex/graph/expand/version`)
   - Returns dependencies of a specific version
   - Request: `{ version_purl: string }`
   - Response: Package nodes with DEPENDS_ON edges

### Data Structures

```typescript
interface GraphNode {
  id: string // PURL format
  label: string // Package name or version
  type: string // PyPIPackage, NPMPackage, Version, etc.
  props: {
    name: string
    purl: string
    // Package nodes:
    vendor?: string
    repository_url?: string
    // Version nodes:
    release_date?: string
    vulnerabilities?: string[]
    serial_number?: number
  }
}

interface GraphEdge {
  id: string // Format: {source}_{type}_{target}
  source: string // Node ID
  target: string // Node ID
  type: string // HAVE or DEPENDS_ON
  props?: {
    constraints?: string // Version constraints
    parent_version_name?: string
  }
}
```

### Frontend Logic

```typescript
if (node.type === 'Version') {
  // Expand version dependencies
  expandVersion({ version_purl: node.props.purl })
} else {
  // Expand package versions (PyPIPackage, NPMPackage, etc.)
  expandPackage({ node_type: node.type, package_purl: node.props.purl })
}
```

### Key Points

- **Node limit:** 200 nodes with UI warning
- **PURL format:** `pkg:pypi/package@version` or `pkg:pypi/package`
- **Edge types:** HAVE (package→version), DEPENDS_ON (version→package)
- **Deduplication:** Frontend handles automatically
- **Tracking:** Prevents duplicate API calls for expanded nodes

---

## 🔗 Important Links

- **Docs:** https://securechaindev.github.io/
- **GitHub:** https://github.com/securechaindev/securechain-frontend
- **Data Dumps:** https://doi.org/10.5281/zenodo.16739081
- **Local Neo4j:** http://localhost:7474/

---

## 🛠️ Quick Guide for AI Agents

### Adding a new feature:

1. Create types in `/types/NewFeature.ts`
2. Create hooks in `/hooks/api/useNewFeature.ts`
3. Create components in `/components/feature/newfeature/`
4. Add routes in `/app/[locale]/newfeature/`
5. Add translations in `/public/locales/{en,es}/newfeature.json`

### Modifying UI:

1. Check `/components/ui/` for existing components
2. Add with shadcn if needed: `npx shadcn-ui@latest add [component]`
3. Use Tailwind for styling

### Adding endpoints:

1. Define in `/constants/apiEndpoints.ts`
2. Create type in `/types/`
3. Create hook in `/hooks/api/`

### Debugging:

- Check `/lib/config/config.ts` for env vars
- Review `middleware.ts` for auth issues
- Browser console and Network tab for API calls

---

## 📚 Technical Resources

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev
- **Tailwind:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com/docs/components
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev

---

## ⚠️ Important Considerations

1. **Static Export**: Project uses `output: 'export'`, meaning no SSR at runtime
2. **Trailing Slashes**: All routes must end with `/`
3. **Image Optimization**: Disabled, use manually optimized images
4. **Build Errors**: TypeScript and ESLint errors are ignored during build (configure as needed)
5. **Localization**: All routes MUST have locale (`/en/` or `/es/`)
6. **Authentication**: Requires running backend for login
7. **Docker Network**: Frontend, backend and DBs must be on `securechain` network

---

## 🎯 Suggested Next Steps

If you are an AI agent working on this project:

1. Review the folder structure to familiarize yourself
2. Read types in `/types/` to understand the domain
3. Examine existing components before creating new ones
4. Respect established code conventions
5. Verify changes are compatible with i18n
6. Test in both themes (light/dark)
7. Ensure API calls handle errors
8. Maintain consistency with the design system

---

**Last updated:** November 2025  
**Maintained by:** Secure Chain Team
