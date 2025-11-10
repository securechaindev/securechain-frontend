# CLAUDE.md - SecureChain Frontend Project Context

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

### Main Framework

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Programming language
- **Node.js 18.19.1+** - Minimum required runtime

### UI and Styling

- **Tailwind CSS 3.4.17** - CSS utility framework
- **Radix UI** - Accessible unstyled components
- **Lucide React** - Icons
- **React Icons** - Additional icons
- **class-variance-authority** - Component variants
- **tailwind-merge** - Tailwind class merging
- **tailwindcss-animate** - Animations

### Internationalization

- **i18next** - i18n system
- **react-i18next** - React integration
- **next-i18next** - Next.js integration
- Supported languages: **English (en)** and **Spanish (es)**

### Forms and Validation

- **React Hook Form 7.54.1** - Form management
- **Zod 3.24.1** - Schema validation
- **@hookform/resolvers** - Resolvers for RHF

### State and Data

- **React Context API** - State management (PackageContext)
- Custom hooks in `/hooks` for reusable logic
- Custom API client in `/lib/api`

### Charts and Visualizations

- **Recharts 2.15.0** - Charts
- **react-day-picker** - Date picker

### Theming

- **next-themes** - Theme system (light/dark/system)

### Other Tools

- **date-fns** - Date manipulation
- **embla-carousel-react** - Carousels
- **react-resizable-panels** - Resizable panels
- **geist** - Typography font

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
- **HTTP-Only Cookies** for storing tokens
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
# URLs
NEXT_PUBLIC_API_URL=http://localhost:8000      # Backend API
NEXT_PUBLIC_APP_URL=http://localhost:3000      # Frontend URL
BACKEND_URL=http://localhost:8000              # For middleware

# Authentication (NextAuth - optional)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Optional: Analytics and Monitoring
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
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

### shadcn/ui

- Base components in `/components/ui`
- Built on Radix UI primitives
- Fully customizable
- Accessible by default (ARIA)

### Themes

- **Light**
- **Dark**
- **System** - Detects OS preference
- Toggle via `<ThemeToggle />`
- Stored in localStorage

### Color Palette

Defined in `tailwind.config.ts` with CSS variables:

- `--background`, `--foreground`
- `--primary`, `--secondary`, `--accent`
- `--destructive`, `--muted`, `--border`
- Support for light and dark modes

---

## 🔌 Backend Integration

### API Client

- Located in `/lib/api/apiClient.ts`
- Based on native `fetch`
- Includes interceptors for:
  - Adding Authorization header
  - Error handling
  - Retry logic
  - Timeout (30s)

### API Hooks

All in `/hooks/api/`:

- `useAuthenticatedApi` - Client with auth
- `usePackageInfo` - Package info
- `usePackageOperations` - Package CRUD
- `useRepositories` - Repository management
- `useVersionInfo` - Version information
- `useVEXOperations` - VEX operations
- `useTIXOperations` - TIX operations

### Endpoints

Defined in `/constants/apiEndpoints.ts`

---

## 🏠 Main Features

### 1. Dependency Explorer (DepEx)

- Visual dependency explorer
- Graph visualization
- Vulnerability analysis
- Supports: PyPI, NPM, Maven, RubyGems, Cargo, NuGet

### 2. VEX Generation

- VEX (Vulnerability Exploitability eXchange) generation
- Vulnerability documentation
- Export in standard formats

### 3. TIX (Threat Intelligence Exchange)

- Threat intelligence exchange
- Integration with vulnerability databases

### 4. Repository Management

- Git repository management
- Dependency analysis in repos

### 5. Package Analysis

- Detailed package analysis
- Version history
- Vulnerability detection

---

## 🗄️ State Management

### Context API

- **PackageContext** - Global package state
- **AuthProvider** - Authentication state
- **ThemeProvider** - Theme state

### Local Storage Keys

```typescript
STORAGE_KEYS = {
  USER_EMAIL: 'user_email',
  THEME: 'theme',
  LOCALE: 'locale',
  HOME_ACTIVE_TAB: 'home-active-tab',
}
```

---

## 🚀 Next.js Configuration

### Key Features

```javascript
{
  output: 'export',              // Static export
  trailingSlash: true,           // URLs with trailing slash
  images: { unoptimized: true }, // No image optimization
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
}
```

### Routes

- **App Router** (Next.js 13+)
- Server Components by default
- Client Components with 'use client'

---

## 🐳 Docker and Deployment

### Local Development

```bash
# With Docker Compose
docker compose -f dev/docker-compose.yml up --build

# Without Docker (Node)
pnpm install
pnpm dev
```

### Production

```bash
pnpm build
pnpm start
```

### Docker Network

- Name: `securechain`
- Connects frontend with backend and databases

---

## 📦 Package Management

### Package Manager: pnpm

- Workspace: `pnpm-workspace.yaml`
- Lockfile: `pnpm-lock.yaml`

### Available Scripts

```bash
pnpm dev           # Development (port 3000)
pnpm build         # Production build
pnpm start         # Production server
pnpm lint          # ESLint
pnpm lint:fix      # ESLint with auto-fix
pnpm format        # Prettier
pnpm format:check  # Check formatting
pnpm type-check    # Check TypeScript types
```

---

## 🧪 Testing and Quality

### Tools

- **ESLint** - Linting with TypeScript
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### Configuration

- `.eslintrc` with custom rules
- Next.js integration
- Import sorting

---

## 🔍 Package Node Types

```typescript
NODE_TYPES = {
  PYPI: 'PyPIPackage', // Python
  NPM: 'NPMPackage', // Node.js
  MAVEN: 'MavenPackage', // Java
  RUBYGEMS: 'RubyGemsPackage', // Ruby
  CARGO: 'CargoPackage', // Rust
  NUGET: 'NuGetPackage', // .NET
}
```

---

## 🚨 Vulnerability Severity

```typescript
VULNERABILITY_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
}
```

---

## 📝 Code Conventions

### TypeScript

- **Strict mode** enabled
- **Interfaces** over types (preferred)
- **Named exports** instead of default
- Path alias: `@/` points to project root

### React Components

- **Functional Components** with hooks
- **Client Components** explicit with 'use client'
- Props with TypeScript interfaces
- Props destructuring

### Styling

- **Tailwind utility-first**
- Use `cn()` helper to combine classes
- Components with variants using CVA

### File Structure

- `index.ts` for exports
- Co-location of related files
- Naming: PascalCase for components, camelCase for hooks/utils

---

## 🔗 Important Links

- **Documentation:** https://securechaindev.github.io/
- **GitHub:** https://github.com/securechaindev/securechain-frontend
- **Data Dumps:** https://doi.org/10.5281/zenodo.16739081
- **Neo4j Browser:** http://localhost:7474/ (when running locally)
- **MongoDB Compass:** Recommended for MongoDB GUI

---

## 🛠️ Quick Guide for AI Agents

### To add a new feature:

1. **Create types** in `/types/NewFeature.ts`
2. **Create hooks** in `/hooks/api/useNewFeature.ts`
3. **Create components** in `/components/feature/newfeature/`
4. **Add routes** in `/app/[locale]/newfeature/`
5. **Add translations** in `/public/locales/{en,es}/newfeature.json`
6. **Update constants** if necessary

### To modify UI:

1. Check if component exists in `/components/ui/`
2. If not, consider adding with shadcn: `npx shadcn-ui@latest add [component]`
3. Customize in `/components/ui/` as needed
4. Use Tailwind for styling

### To add endpoints:

1. Define in `/constants/apiEndpoints.ts`
2. Create type in `/types/`
3. Create hook in `/hooks/api/`
4. Use hook in component

### For debugging:

- Review `/lib/config/config.ts` for environment vars
- Check middleware.ts for auth issues
- Check browser console
- Review Network tab for API calls

---

## 📚 Technical Resources

### Key Dependency Documentation

- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Radix UI: https://www.radix-ui.com
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev
- i18next: https://www.i18next.com

### shadcn/ui Components

- Catalog: https://ui.shadcn.com/docs/components
- Installation: `npx shadcn-ui@latest add [component]`

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
