# Secure Chain Landing Page

Landing page for Secure Chain's open-source cybersecurity tools: Depex and VEXGen.

## Features

- Responsive design with mobile navigation
- Dark mode support
- Tool overview and comparison
- Repository submission form with Web3Forms email integration
- Use cases and feature highlights

## Email Configuration

This project uses Web3Forms for email submissions. The Web3Forms access key is stored as an environment variable:

\`\`\`env
WEB3FORMS_ACCESS_KEY=your_access_key_here
\`\`\`

To get your own access key:

1. Go to [Web3Forms](https://web3forms.com/)
2. Sign up for a free account
3. Create a new form and get your access key
4. Add it to your environment variables

## Tools Featured

- **Depex**: Dependency Explorer & Vulnerability Detector
- **VEXGen**: Automated VEX Document Generator

## Development

Built with:

- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui components
- TypeScript
