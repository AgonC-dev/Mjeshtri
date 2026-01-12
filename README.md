# Mjeshtri.ks - Handyman Service Directory for Kosovo

A modern React.js application for connecting users with skilled handymen and service providers across Kosovo.

## Features

- 🏠 **Home Page**: Hero search, category grid, and featured workers
- 🔍 **Worker List**: Search and filter workers by city and category
- 👤 **Worker Profiles**: Detailed profiles with portfolio, statistics, and direct WhatsApp contact
- 📝 **Worker Registration**: Simple form for workers to register their services
- 💬 **WhatsApp Integration**: Direct contact via WhatsApp with pre-filled messages

## Tech Stack

- **Framework**: React.js with Vite
- **Styling**: CSS Modules
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)

## Design Theme

**Royal Noir & Emerald** - Modern dark mode design:
- Background: Deep Charcoal (#121212) / Matte Black (#000000)
- Primary Accent: Electric Emerald Green (#00FF85)
- Secondary: Slate Gray (#1A1A1A)
- Text: Off-white (#E0E0E0)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── CategoryGrid/
│   ├── FeaturedWorkers/
│   ├── FilterSidebar/
│   ├── Footer/
│   ├── Header/
│   ├── Hero/
│   ├── WhatsAppButton/
│   └── WorkerCard/
├── pages/              # Page components
│   ├── Home/
│   ├── WorkerList/
│   ├── WorkerProfile/
│   └── WorkerRegister/
├── App.jsx             # Main app component with routing
├── App.module.css      # App styles
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Routes

- `/` - Home page
- `/workers` - Worker list with filters
- `/worker/:id` - Individual worker profile
- `/register` - Worker registration form

## WhatsApp Integration

The WhatsApp button uses the format:
```
https://wa.me/{phoneNumber}?text={encodedMessage}
```

Default message: "Pershendetje ju gjeta ne Mjeshtri.ks"

## License

MIT
