# Chalet Management System

A comprehensive multi-site web application for chalet management business, featuring a marketing site, admin dashboard, individual chalet sites, and complete booking system with Stripe integration.

## Features

### Marketing Site
- **Home Page**: Hero section, service overview, testimonials, and call-to-action
- **Services Page**: Detailed descriptions of rental management, tax handling, concierge services, and event planning
- **Portfolio Page**: Displays all managed chalets with filtering, search, and detailed listings
- **Portage Salarial Page**: Explains the tripartite employment arrangement with benefits and conditions
- **Seminars & Events Page**: MICE event planning and yoga seminars with Les Joly Dames partnership
- **Contact Page**: Contact form with project type selection and validation

### Admin Dashboard
- JWT-based secure authentication
- Dashboard with statistics and recent activity
- CRUD operations for chalets, bookings, and content management
- User management system
- Content management for all site pages

### Individual Chalet Sites
- Auto-generated responsive sites for each chalet
- Interactive photo galleries with lightbox
- Comprehensive booking system with Stripe integration
- Interactive maps using Leaflet and OpenStreetMap
- Detailed amenities and specifications display

### Booking & Payment System
- Multi-step booking process with validation
- Stripe checkout integration
- Automatic email confirmations
- Webhook handling for payment events
- Booking management and tracking

## Tech Stack

- **Framework**: Next.js 15 (App Router) with JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: JWT-based admin authentication
- **Payments**: Stripe API with secure checkout and webhooks
- **Maps**: Leaflet with OpenStreetMap tiles
- **Email**: Nodemailer for transactional emails
- **Deployment**: Environment variable configuration for production

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chalet-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following environment variables in `.env`:
   ```
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/chalet-management
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Stripe Configuration
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   # Optional: customize the base folder that will contain all uploads
   CLOUDINARY_BASE_FOLDER=portage-salarial
   ```

4. **Database Setup**
   - Install and start MongoDB
   - The application will automatically create the necessary collections

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard pages
│   ├── api/                      # API routes
│   ├── chalet/[slug]/           # Individual chalet pages
│   ├── contact/                  # Contact page
│   ├── portfolio/                # Portfolio page
│   ├── portage-salarial/        # Portage salarial page
│   ├── seminaires-evenements/   # Seminars & events page
│   ├── services/                 # Services page
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.js                  # Home page
├── components/                   # Reusable components
│   ├── chalet/                  # Chalet-specific components
│   ├── layout/                  # Layout components
│   └── ClientIcon.js            # Icon wrapper component
├── lib/                         # Utility libraries
│   ├── auth.js                  # Authentication utilities
│   ├── email.js                 # Email utilities
│   ├── mongodb.js               # Database connection
│   ├── stripe.js                # Stripe integration
│   └── utils.ts                 # General utilities
├── models/                      # Mongoose schemas
│   ├── Booking.js               # Booking model
│   ├── Chalet.js                # Chalet model
│   ├── Content.js               # Content management model
│   ├── PortfolioItem.js         # Portfolio item model
│   └── User.js                  # User model
├── .env.example                 # Environment variables template
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── README.md                    # This file
```

## API Routes

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin user
- `GET /api/auth/verify` - Verify JWT token

### Chalets
- `GET /api/chalets` - List all chalets
- `POST /api/chalets` - Create new chalet (protected)
- `GET /api/chalets/[slug]` - Get single chalet
- `PUT /api/chalets/[slug]` - Update chalet (protected)
- `DELETE /api/chalets/[slug]` - Delete chalet (protected)

### Bookings
- `GET /api/bookings` - List bookings (protected)
- `POST /api/bookings` - Create new booking

### Stripe
- `POST /api/stripe/create-checkout-session` - Create payment session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Content Management
- `GET /api/content` - Get page content
- `POST /api/content` - Create/update content (protected)

### Portfolio
- `GET /api/portfolio` - Get portfolio items
- `POST /api/portfolio` - Create portfolio item (protected)

### Contact
- `POST /api/contact` - Send contact form email

### System Status & Demo Data
- `GET /api/system-status` - Verify site availability and database health
- `POST /api/system-status` - Generate fake content blocks for a given page (development only)

## Database Models

### Chalet
- Basic information (title, description, images)
- Location with coordinates
- Specifications (bedrooms, bathrooms, max guests)
- Pricing and availability
- Amenities and features
- SEO metadata

### Booking
- Guest information
- Stay dates and duration
- Pricing breakdown
- Payment status and Stripe integration
- Communication history
- Cancellation handling

### User
- Admin authentication
- Role-based access control
- Password hashing with bcrypt
- Login tracking

### Content
- Page-based content management
- Version history
- SEO optimization
- Media attachments
- Publishing controls

### PortfolioItem
- Chalet showcase management
- Custom descriptions and images
- External booking links
- Display ordering
- Analytics tracking

## Stripe Integration

The application includes complete Stripe integration for secure payments:

1. **Checkout Sessions**: Create secure payment sessions
2. **Webhooks**: Handle payment events automatically
3. **Booking Confirmation**: Automatic booking creation on successful payment
4. **Email Notifications**: Send confirmation emails to guests

### Webhook Setup
Configure your Stripe webhook endpoint to point to:
```
https://yourdomain.com/api/stripe/webhook
```

Listen for these events:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## Deployment

### Environment Variables
Ensure all environment variables are properly configured for production:

- Use production MongoDB URI
- Set production Stripe keys
- Configure email service credentials
- Set secure JWT secret
- Update NEXT_PUBLIC_SITE_URL

### Build and Deploy
```bash
npm run build
npm start
```

### Static Export (Optional)
The application supports static export for hosting on CDNs:
```bash
npm run build
```

## Security Features

- JWT-based authentication with secure token handling
- Password hashing using bcrypt
- Protected API routes with middleware
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Stripe webhook signature verification

## Performance Optimizations

- Next.js Image optimization
- Static generation where possible
- Efficient database queries with Mongoose
- Lazy loading for components
- Optimized Tailwind CSS bundle
- CDN-ready static assets

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement
- Accessibility features (WCAG 2.1 AA)

## Developer documentation

- [Architecture overview](./docs/ARCHITECTURE.md) – explains how the Next.js app, API routes, Mongoose models and shared libraries interact.
- [API reference](./docs/API_REFERENCE.md) – documents the major REST endpoints, authentication rules and query parameters.
- [Testing strategy](./docs/TESTING_STRATEGY.md) – step-by-step plan for introducing automated coverage using Vitest, Testing Library and an in-memory MongoDB instance.
- [Security & compliance enhancements](./docs/SECURITY_PRACTICES.md) – recommended hardening controls (rate limiting, backups, GDPR workflows, monitoring).

These living documents address the current gaps in technical documentation and should be updated alongside new features.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Follow the [testing roadmap](./docs/TESTING_STRATEGY.md) to add or update coverage where possible
5. Reference relevant documentation updates in your pull request description
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or refer to the project documentation.