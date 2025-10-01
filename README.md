# Digital Business Cards Platform 🚀

A modern, scalable SaaS platform for creating professional digital business cards with advanced customization features, real-time analytics, and subscription-based monetization.

## 🌟 Features

### Core Features
- **Advanced Visual Editor**: Real-time preview with intuitive customization
- **Modern Design System**: Glassmorphism effects, animations, and premium templates
- **AI-Powered Suggestions**: Smart color palettes and content enhancement
- **QR Code Generation**: Instant sharing and networking
- **Mobile-First Design**: Responsive across all devices
- **Analytics Dashboard**: Track views, clicks, and engagement

### Business Features
- **User Authentication**: Google OAuth integration with NextAuth.js
- **Subscription Management**: Stripe-powered billing with multiple tiers
- **Database Persistence**: PostgreSQL with Prisma ORM
- **Multi-tenant Architecture**: Scalable user and card management
- **Dashboard & Analytics**: Comprehensive user analytics and insights

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, React Bootstrap, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js with Google Provider
- **Payments**: Stripe Subscriptions
- **Styling**: CSS-in-JS, Bootstrap 5, Custom animations
- **Deployment**: Vercel-ready with PostgreSQL database

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd digital-business-card-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/digital_cards_db?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PROFESSIONAL_PRICE_ID="price_professional"
STRIPE_BUSINESS_PRICE_ID="price_business"
STRIPE_ENTERPRISE_PRICE_ID="price_enterprise"

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

5. **Start Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Configuration Guide

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Stripe Setup
1. Create a [Stripe account](https://stripe.com)
2. Get API keys from the dashboard
3. Create subscription products and get price IDs
4. Configure webhook endpoint: `/api/webhooks/stripe`

### Database Setup (Production)
- **Supabase**: PostgreSQL with built-in auth, real-time, and edge functions (Recommended)
- **Vercel**: Use Vercel Postgres or connect external PostgreSQL
- **Railway**: Deploy PostgreSQL instance
- **PlanetScale**: MySQL-compatible option with Prisma

## 🏆 Subscription Plans

| Plan | Price | Cards | Features |
|------|-------|-------|----------|
| **Free** | $0/month | 1 | Basic templates, Analytics |
| **Professional** | $12.99/month | 5 | Premium templates, No watermark, Custom domain |
| **Business** | $39.99/month | 25 | Team features, API access, White-label |
| **Enterprise** | $199+/month | Unlimited | Full customization, SLA, Priority support |

## 📁 Project Structure

```
digital-business-card-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   ├── pricing/           # Pricing page
│   │   └── card/[id]/         # Public card pages
│   ├── components/            # React components
│   │   ├── BusinessCard.tsx   # Card display component
│   │   ├── BusinessCardGenerator.tsx # Card editor
│   │   └── AuthWrapper.tsx    # Authentication wrapper
│   ├── lib/                   # Utilities and services
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── db.ts             # Prisma client
│   │   ├── stripe.ts         # Stripe configuration
│   │   └── cardService.ts    # Card CRUD operations
│   └── hooks/                 # Custom React hooks
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── .env                      # Environment variables
```

## 🔧 API Endpoints

### Cards Management
- `GET /api/cards` - Get user's cards
- `POST /api/cards` - Create new card
- `GET /api/cards/[id]` - Get public card
- `PUT /api/cards/[id]` - Update card
- `DELETE /api/cards/[id]` - Delete card

### Payments
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

## 🚀 Deployment

### Netlify + Supabase Deployment (Recommended)

**Why Netlify + Supabase?**
- ✅ **Supabase**: PostgreSQL + Auth + Real-time + Edge Functions
- ✅ **Netlify**: Global CDN + Serverless Functions + Easy deploys
- ✅ **Cost-effective**: Both have generous free tiers
- ✅ **Developer Experience**: Excellent tooling and documentation
- ✅ **Scalability**: Handle millions of users seamlessly

#### 1. Setup Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Save your database URL and keys

2. **Configure Database**
```bash
# Update your .env with Supabase credentials
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

3. **Run Migrations**
```bash
npx prisma db push
```

#### 2. Deploy on Netlify

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub repository
   - Netlify will automatically detect Next.js settings
   - Click "Deploy site"

3. **Configure Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   NEXTAUTH_URL=https://your-site-name.netlify.app
   NEXTAUTH_SECRET=your-secret-key-change-this-in-production
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PROFESSIONAL_PRICE_ID=price_professional
   STRIPE_BUSINESS_PRICE_ID=price_business
   STRIPE_ENTERPRISE_PRICE_ID=price_enterprise
   ```

4. **Install Netlify CLI (Optional)**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify link
   netlify dev  # For local development with Netlify Functions
   ```

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm run start
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📊 Business Metrics & KPIs

### Key Metrics to Track
- **User Acquisition**: Sign-ups, activation rate
- **Engagement**: Cards created per user, session duration  
- **Revenue**: MRR, conversion rate, churn rate
- **Technical**: Page load speed, uptime, error rate

### Target KPIs (Year 1)
- 5,000+ registered users
- $31K+ MRR by month 12
- 15%+ free-to-paid conversion rate
- <5% monthly churn rate

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issue for bugs or feature requests
- **Business Inquiries**: Contact for enterprise solutions

---

**Built with ❤️ for modern professionals who want to make lasting digital impressions.**

## 🏗️ Infrastructure Costs (Netlify + Supabase)

### Free Tier Limits
- **Netlify**: 100GB bandwidth, 300 build minutes/month
- **Supabase**: 500MB database, 50MB file storage, 2GB bandwidth
- **Estimated cost**: $0/month for first 100-500 users

### Scale-up Costs
- **Netlify Pro**: $19/month (1TB bandwidth, unlimited builds)
- **Supabase Pro**: $25/month (8GB database, 100GB storage)
- **Total**: ~$44/month for 1,000-5,000 users

### Enterprise Scale
- **Netlify Business**: $99/month
- **Supabase Team**: $599/month
- **Total**: ~$698/month for 50,000+ users

### Revenue Projection vs Infrastructure Costs
- **Month 1**: $260 MRR | $0 infrastructure = **100% profit margin**
- **Month 6**: $9K+ MRR | $44 infrastructure = **99.5% profit margin**
- **Month 12**: $31K+ MRR | $698 infrastructure = **97.7% profit margin**
- **ARR Potential**: $377K+ (Year 1) with **97%+ profit margins**