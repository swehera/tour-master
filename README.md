# TourMaster — Frontend

Next.js 14 frontend for the Tour Management System with full admin dashboard, public landing pages, and complete API integration.

## Tech Stack
| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| State | Zustand |
| HTTP | Axios |
| Forms | React Hook Form |
| Charts | Recharts |
| Icons | Lucide React |
| Theme | next-themes (dark/light) |
| Toasts | react-hot-toast |

## Quick Start

```bash
cd frontend
npm install
# Edit .env.local → set NEXT_PUBLIC_API_URL to your backend URL
npm run dev
```
Open http://localhost:3000

## .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000
```

## Pages
| Route | Description |
|---|---|
| `/` | Landing page with hero, featured tours, testimonials |
| `/tours` | All tours with search, filter, pagination |
| `/tours/[slug]` | Tour detail + booking form |
| `/about` | About page |
| `/contact` | Contact form |
| `/login` | Authentication |
| `/register` | Registration |
| `/dashboard` | Admin dashboard with charts |
| `/dashboard/users` | User management |
| `/dashboard/tours` | Tour management (CRUD) |
| `/dashboard/bookings` | Booking management |

## Features
- Dark / light mode toggle
- JWT auth with auto-refresh
- Role-based access (admin, guide, user)
- Protected dashboard routes via Next.js middleware
- Image upload for tours and avatars
- Real-time search and filtering
- Paginated data tables
- Revenue charts (Recharts)
- Fully responsive mobile layout
