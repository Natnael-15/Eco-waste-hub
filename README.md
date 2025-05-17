# Eco Waste Hub

A modern web application focused on sustainability and food waste reduction, built with React, TypeScript, and Supabase.

## Features

- User authentication and authorization
- Product catalog and shopping cart
- Food deals and discounts
- Donation system
- Admin dashboard
- Partner management
- Order tracking
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Authentication, Database, Storage)
- React Router
- React Query

## Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account

## Setup


1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API and external service integrations
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 