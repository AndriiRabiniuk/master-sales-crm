# Master Sales CRM

A comprehensive Customer Relationship Management system for sales teams, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication and role-based access control
- Client management with detailed information
- Contact management with client associations
- Dashboard with key metrics and charts
- Responsive design for desktop and mobile devices
- Modern UI with Tailwind CSS styling

## Tech Stack

- **Frontend**: Next.js, TypeScript, React, Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: react-hook-form
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: react-icons
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios
- **Notifications**: react-toastify

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/master-sales-crm.git
   cd master-sales-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── clients/      # Client-related components
│   ├── common/       # Common UI components
│   ├── contacts/     # Contact-related components
│   └── layout/       # Layout components
├── contexts/         # React context providers
├── pages/            # Next.js pages
│   ├── clients/      # Client pages
│   ├── contacts/     # Contact pages
│   └── api/          # API routes
├── services/         # API services
│   └── api/          # API client services
└── styles/           # Global styles
```

## API Integration

The frontend connects to a backend API at the URL specified in the `NEXT_PUBLIC_API_URL` environment variable. The API should provide endpoints for:

- Authentication (login, register, token validation)
- Client management (CRUD operations)
- Contact management (CRUD operations)
- Dashboard metrics

## Deployment

The application can be deployed to various platforms like Vercel, Netlify, or any hosting service that supports Next.js applications.

```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React community for the awesome ecosystem
