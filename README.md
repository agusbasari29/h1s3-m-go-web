# h1s3-m-go-web

ONT Device Management Dashboard - Next.js Frontend

## Overview

Web dashboard for managing ONT (Optical Network Terminal) devices. Built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **API**: Connects to h1s3-m-go backend

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/agusbasari29/h1s3-m-go-web.git
cd h1s3-m-go-web

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Features

- Device registration and management
- Real-time device monitoring
- WAN/WiFi status dashboard
- Device history and snapshots
- Responsive design

## API Integration

The frontend connects to the h1s3-m-go backend:

| Endpoint | Description |
|----------|-------------|
| POST /devices | Register device |
| GET /devices | List devices |
| GET /devices/:id | Get device details |
| DELETE /devices/:id | Delete device |
| GET /devices/:id/history | Device history |
| POST /devices/:id/refresh | Refresh device data |

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx     # Home page
│   ├── layout.tsx   # Root layout
│   └── devices/     # Device pages
├── components/       # React components
│   ├── ui/         # Base components
│   └── devices/    # Device-specific
├── lib/            # Utilities
├── types/          # TypeScript types
└── app/globals.css # Tailwind
```

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Linting & Formatting

```bash
# ESLint
npm run lint

# Prettier
npm run format
```

## License

MIT
