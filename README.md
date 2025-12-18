# 🚀 Professional Portfolio - Next.js 14

A world-class, Apple-inspired portfolio website built with Next.js 14, TypeScript, Supabase, and Framer Motion. Features a fully customizable admin panel, automatic translations, and stunning animations.

## ✨ Features

- 🎨 **Apple-Inspired Design** - Smooth animations, glassmorphism, and premium aesthetics
- 🌍 **Multilingual** - English/Spanish with automatic translation caching
- 🔐 **Secure Admin Panel** - Full CRUD operations with Supabase Auth
- ⚡ **Performance Optimized** - Next.js 14 App Router, Image Optimization, Lazy Loading
- 📱 **Fully Responsive** - Mobile-first design approach
- 🎭 **Framer Motion Animations** - Smooth scroll animations, parallax effects
- 📧 **Contact Form** - Integrated with Resend for email notifications
- 🗄️ **Supabase Backend** - PostgreSQL database with Row Level Security
- 🎯 **SEO Optimized** - Dynamic metadata, OG images, sitemap generation

## 📋 Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Custom Apple-inspired theme)
- **Framer Motion** (Animations)
- **next-intl** (Internationalization)
- **shadcn/ui** (UI Components)
- **Lucide React** (Icons)

### Backend & Services

- **Supabase** (Database, Auth, Storage)
- **Resend** (Email delivery)
- **LibreTranslate** (Automatic translations - free alternative)

### Dev Tools

- **ESLint** (Code linting)
- **TypeScript** (Type checking)
- **Zod** (Schema validation)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- A Resend account (free tier works)

## 📁 Project Structure

```
dagr-portfolio/
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── layout.tsx         # Locale layout with next-intl
│   │   ├── page.tsx           # Home page
│   │   └── projects/          # All projects page
│   ├── admin/                 # Admin panel
│   │   ├── layout.tsx         # Admin layout with auth
│   │   ├── dashboard/         # Dashboard page
│   │   ├── hero/              # Hero management (TO IMPLEMENT)
│   │   ├── about/             # About management (TO IMPLEMENT)
│   │   ├── experience/        # Experience management (TO IMPLEMENT)
│   │   ├── projects/          # Projects management (TO IMPLEMENT)
│   │   ├── certifications/    # Certifications management (TO IMPLEMENT)
│   │   ├── skills/            # Skills management (TO IMPLEMENT)
│   │   ├── awards/            # Awards management (TO IMPLEMENT)
│   │   └── settings/          # Settings (TO IMPLEMENT)
│   ├── api/
│   │   └── contact/           # Contact form API route
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── sections/              # Portfolio sections
│   │   ├── Hero.tsx           # ✅ IMPLEMENTED
│   │   ├── About.tsx          # TO IMPLEMENT
│   │   ├── Experience.tsx     # TO IMPLEMENT
│   │   ├── Projects.tsx       # TO IMPLEMENT
│   │   ├── Certifications.tsx # TO IMPLEMENT
│   │   ├── Skills.tsx         # TO IMPLEMENT
│   │   ├── Awards.tsx         # TO IMPLEMENT
│   │   └── Contact.tsx        # TO IMPLEMENT
│   ├── admin/                 # Admin-specific components
│   │   └── (to implement)
│   └── animations/            # Animation wrappers
│       ├── FadeIn.tsx         # ✅ IMPLEMENTED
│       └── Stagger.tsx        # ✅ IMPLEMENTED
├── lib/
│   ├── supabase/              # Supabase configuration
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   ├── middleware.ts      # Auth middleware
│   │   └── types.ts           # Database types
│   ├── translations.ts        # Translation utilities
│   └── utils.ts               # Utility functions
├── messages/                  # Translation files
│   ├── en.json                # English translations
│   └── es.json                # Spanish translations
├── public/                    # Static assets
│   ├── images/
│   └── videos/
├── supabase-schema.sql        # Database schema
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🎯 Implementation Guide

### Already Implemented ✅

1. **Project Setup**

   - Next.js 14 with TypeScript
   - Tailwind CSS with Apple-inspired theme
   - All dependencies installed

2. **Supabase Integration**

   - Complete database schema
   - Client/server utilities
   - Authentication middleware
   - Type definitions

3. **Internationalization**

   - next-intl configuration
   - Language switching structure
   - Translation messages (en/es)

4. **UI Components**

   - shadcn/ui base components (Button, Card, Input, Label)
   - Animation components (FadeIn, Stagger)
   - Apple-inspired styling

5. **Hero Section**

   - Fully functional with animations
   - Supabase data integration
   - Social links, profile image, resume download

6. **Admin Panel Structure**

   - Authentication layout
   - Dashboard with stats
   - Navigation sidebar
   - Protected routes

7. **Services**
   - Contact form API with Resend
   - Translation utility with caching
   - Image optimization setup

## 🎨 Styling Guidelines

### Apple-Inspired Design Principles

1. **Spacing**: Generous whitespace, never cramped
2. **Typography**: Large, bold headlines with lighter body text
3. **Colors**: Stick to the defined color palette in `tailwind.config.ts`
4. **Animations**: Subtle, smooth, never jarring
5. **Cards**: Rounded corners, subtle shadows, hover states
6. **Buttons**: Clear hierarchy (primary vs secondary)

## 🔒 Security Considerations

1. **RLS Policies**: Already configured in schema - public can read visible content, only authenticated can write
2. **Admin Access**: Controlled by `ADMIN_EMAILS` env variable
3. **File Uploads**: Validate file types and sizes in admin forms
4. **Rate Limiting**: Consider adding rate limiting to contact form
5. **Environment Variables**: Never commit `.env.local`

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Build command
npm run build

# Start command
npm run start
```

## 📚 Additional Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
