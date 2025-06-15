
# Campus Eats

A modern web application for campus food delivery and canteen management. Connect students with their favorite campus dining options through an intuitive ordering platform.

## Features

- 🍕 Browse multiple campus canteens and their menus
- 🛒 Smart shopping cart with real-time updates
- 👤 User authentication and profile management
- 📱 Responsive design for mobile and desktop
- 🔔 Real-time order notifications
- 📊 Order tracking and history
- ⭐ Food ratings and reviews

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd campus-eats
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── integrations/       # Third-party integrations
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

The application can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

For production deployment:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
