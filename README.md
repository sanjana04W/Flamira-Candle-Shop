# 🕯️ Flamira - Candle & Gift Shop

> A modern, mobile-first e-commerce platform for **Flamira**, a Sri Lankan handmade candle, home décor, and gifting business.

Flamira is designed to transform a social-commerce business into a centralized online store where customers can discover products, check availability, place Cash on Delivery (COD) orders, and track their purchases — while the business owner manages products, inventory, customers, orders, promotions, and analytics from a dedicated admin panel.

---

## ✨ Project Overview

Flamira currently operates primarily through social media and conversational ordering. Customers discover products through Facebook and TikTok and contact the business through messages to ask about prices, availability, delivery, and ordering.

The Flamira website aims to replace this manual workflow with a self-service e-commerce experience.

### Current Challenges

- Products are distributed across individual social-media posts.
- Customers cannot easily browse the complete catalogue.
- Prices and availability have to be confirmed manually.
- Orders are stored inside chat conversations.
- There is no centralized inventory management.
- There is no standardized order number or order-status system.
- Sales attribution is difficult.
- Delivery and return policies are not centrally visible.
- The business is heavily dependent on social-media platforms.

The proposed solution is a **Next.js + Firebase e-commerce platform** with a custom admin dashboard.

---

## 🎯 Project Goals

### 1. Self-Service Shopping

Allow customers to:

- Browse the complete Flamira collection
- Search and filter products
- View product prices and availability
- Select product variants
- Add products to a cart
- Calculate delivery charges
- Place COD orders without creating an account
- Receive an order number
- Track their order

The target is for at least **50% of monthly orders** to be placed through the website within three months of launch.

### 2. Centralized Business Management

Provide the owner with a single dashboard for:

- Products
- Categories
- Inventory
- Orders
- Customers
- Delivery rates
- Promotions
- Reviews
- Content
- Reports
- Analytics

All web orders should have an order number and status, with stock automatically managed by the system.

### 3. Measurable Marketing

Integrate:

- Meta Pixel
- Meta Conversions API
- TikTok Pixel
- TikTok Events API
- Google Analytics 4
- Google Search Console
- UTM campaign tracking

This allows Flamira to understand which social posts, campaigns, and advertisements generate actual orders.

---

# 🛍️ Main Features

## Customer Storefront

### 🏠 Home Page

The homepage includes:

- Seasonal hero section
- Featured collections
- Product categories
- Best sellers
- New arrivals
- Customer reviews
- User-generated content
- Trust badges
- Social-media content
- WhatsApp contact option

### 🛒 Shop

Customers can browse the entire catalogue and filter products by:

- Category
- Occasion
- Price
- Availability

Products are paginated and server-rendered for better SEO and performance.

### 🕯️ Product Details

Each product can contain:

- Product name
- Product code / SKU
- Images
- Short video
- Price
- Sale price
- Variants
- Stock status
- Product description
- Dimensions
- Materials
- Colour / finish
- Delivery estimate
- Delivery charge
- Reviews
- Related products
- Personalization options

### 🛒 Cart

Customers can:

- Add/remove products
- Change quantities
- Review subtotal
- View delivery charges
- Apply coupons
- Review final order total

### 📦 Checkout

The checkout is designed as a simple guest checkout.

Required information includes:

- Customer name
- Phone number
- WhatsApp number
- Email
- Delivery address
- District
- Optional gift note

COD is the default payment method at launch. Phone verification is planned to reduce fake COD orders.

### 🔎 Order Tracking

Customers can track orders using:

```text
Order Number + Phone Number
```

The order confirmation page also functions as a customer-facing tracking page.

---

# 🗂️ Product Categories

The proposed catalogue structure includes:

### Home Décor

- Wall Art & Frames
- Candles & Holders
- Vases & Planters
- Table & Shelf Décor
- Lighting & Fairy Lights

### Gifts

- Gift Boxes & Hampers
- Personalized Gifts
- Couple & Anniversary Gifts
- Corporate & Bulk Gifting

### Handmade & Resin

- Resin Art
- Clay & Ceramic
- Macramé & Fabric

### Seasonal

- Avurudu Collection
- Christmas & New Year
- Valentine's Collection

### Occasion Filters

Products can additionally be tagged with:

- Birthday
- Wedding
- Housewarming
- Anniversary
- Farewell
- Thank You
- Baby & Newborn

Occasions are implemented as tags/filters rather than separate product categories, allowing one product to appear under multiple occasions.

---

# 🔐 Admin Dashboard

The custom admin panel provides the business owner with centralized control.

## Dashboard

Displays:

- Today's orders
- Monthly orders
- Revenue
- Pending actions
- Low-stock alerts
- Best-selling products
- Traffic-source information

## Product Management

Admins can:

- Create products
- Edit products
- Archive products
- Upload images
- Upload videos
- Manage variants
- Update prices
- Update stock
- Manage SEO information
- Import/export catalogue data

## Inventory Management

Inventory supports:

- Stock quantities
- Low-stock thresholds
- Stock movement history
- Automatic stock deduction
- Automatic stock restoration
- Made-to-order products
- Low-stock alerts

Stock is deducted during order creation using a Firestore transaction to prevent overselling during high-demand periods.

## Order Management

Admins can:

- Search orders
- Filter orders
- View customer information
- Update order status
- Add internal notes
- Add courier information
- Add tracking numbers
- Print invoices
- Print courier labels
- Cancel orders
- Export orders

## Customer Management

Customer records can contain:

- Name
- Phone number
- Email
- Addresses
- Order history
- Order count
- Total spending
- Notes
- Last order date

---

# 🔄 Order Workflow

Orders follow the following lifecycle:

```text
Pending
   ↓
Confirmed
   ↓
Processing / Packing
   ↓
Ready to Dispatch
   ↓
Dispatched
   ↓
Delivered
   ↓
Completed
```

### Exception States

```text
Cancelled
Failed Delivery / Returned
Refund / Exchange
```

### Status Descriptions

| Status | Description |
|---|---|
| Pending | Order has been placed |
| Confirmed | Owner has verified the COD order |
| Processing / Packing | Product is being prepared |
| Ready to Dispatch | Package is ready for courier pickup |
| Dispatched | Package has been handed to courier |
| Delivered | Courier confirms delivery |
| Completed | COD payment has been settled |
| Cancelled | Order cancelled before dispatch |
| Failed Delivery / Returned | Delivery failed or customer refused |
| Refund / Exchange | Post-delivery issue handled according to policy |

Revenue reporting counts **Completed** orders rather than merely Delivered orders.

---

# 🧑‍💼 Admin Roles

The system supports role-based access control.

### Owner

Full access to:

- Products
- Inventory
- Orders
- Customers
- Reports
- Settings
- Integrations
- Users
- Financial information

### Manager

Can manage:

- Products
- Categories
- Inventory
- Orders
- Customers
- Content
- Coupons

Cannot access:

- Cost prices
- Margin reports
- System settings
- Pixel configuration
- User management
- Permanent deletion

### Order Staff / Packer

Can:

- View orders
- View order details
- Update fulfilment status
- Add courier tracking numbers

Cannot:

- View revenue
- Edit products
- Edit prices
- Export customer information

### Content Editor

Optional future role for:

- Banners
- Collections
- Product content
- Product images

---

# 🏗️ Technology Stack

| Technology | Purpose |
|---|---|
| **Next.js 14+** | Frontend framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | UI styling |
| **Firebase** | Backend infrastructure |
| **Cloud Firestore** | Database |
| **Firebase Storage** | Product/media storage |
| **Firebase Authentication** | Admin authentication |
| **Firebase Admin SDK** | Secure server-side operations |
| **Firebase Cloud Functions** | Background/event-driven tasks |
| **Vercel** | Hosting & deployment |
| **Brevo** | Transactional email |
| **Meta Pixel** | Meta advertising tracking |
| **Meta Conversions API** | Server-side Meta tracking |
| **TikTok Pixel** | TikTok tracking |
| **TikTok Events API** | Server-side TikTok tracking |
| **Google Analytics 4** | Analytics |
| **Google Search Console** | SEO monitoring |

The proposed architecture uses Next.js App Router with Firebase as the primary backend and Firestore as the main data store.

---

# 🗄️ Database Structure

The primary Firestore collections are:

```text
products
categories
orders
customers
settings
coupons
reviews
adminUsers
counters
```

### Products

```text
products
├── title
├── slug
├── sku
├── categoryId
├── subCategoryId
├── price
├── salePrice
├── stockQty
├── lowStockThreshold
├── images[]
├── videoUrl
├── shortDesc
├── longDesc
├── attributes{}
├── occasionTags[]
├── isCustomizable
├── leadTimeDays
├── status
├── isFeatured
└── seo{}
```

### Orders

```text
orders
├── orderNumber
├── items[]
├── customer{}
├── address{}
├── subtotal
├── deliveryFee
├── discount
├── total
├── paymentMethod
├── paymentStatus
├── orderStatus
├── courier{}
├── source{}
├── statusHistory[]
└── timestamps
```

The order stores a snapshot of product title, price, and SKU at the time of purchase so historical orders are not affected by later product changes.

---

# 🔒 Security

Security is handled at multiple levels.

### Firestore

- Public users can read approved product/category/settings data.
- Client-side writes are blocked.
- Orders are created through secure server-side routes.

### Server Validation

Product price, stock, and delivery charges are recalculated server-side.

Client-submitted prices are **never trusted**.

### Authentication

Firebase Authentication is used for administrators with role-based custom claims.

### Additional Protection

- Phone OTP verification
- Rate limiting
- Server-side validation
- Environment variables for secrets
- Firestore security rules
- Audit logging

The Firebase Admin SDK credentials must never be exposed to the browser.

---

# 📈 Analytics & Marketing

Flamira is designed around social-media-driven traffic.

### Meta

Events:

```text
PageView
ViewContent
AddToCart
InitiateCheckout
AddPaymentInfo
Purchase
```

### TikTok

Events:

```text
ViewContent
AddToCart
InitiateCheckout
CompletePayment
```

### Google Analytics

Enhanced e-commerce tracking will monitor customer behaviour across the shopping funnel.

### UTM Tracking

Campaign parameters are captured when a customer enters the website and associated with the resulting order.

Example:

```text
utm_source=facebook
utm_medium=paid
utm_campaign=valentines_2027
```

This allows the admin panel to identify the source and campaign responsible for an order.

---

# 🚀 SEO & Performance

The website is designed for strong mobile performance and search visibility.

### Performance Targets

- Lighthouse Mobile: **≥ 90**
- LCP: **< 2.5 seconds**
- CLS: **< 0.1**
- INP: **< 200 ms**
- Initial JS: approximately **< 200 KB gzipped**

### SEO Features

- Server-side rendering
- Static generation / ISR
- Optimized product images
- AVIF/WebP
- XML sitemap
- Robots.txt
- Canonical URLs
- Open Graph metadata
- Product structured data
- Organization schema
- LocalBusiness schema
- Breadcrumb schema
- FAQ schema
- Descriptive image alt text

Target search terms include:

```text
home decor Sri Lanka
online gift shop Sri Lanka
handmade gifts Sri Lanka
personalized gifts Sri Lanka
resin art Sri Lanka
gift box delivery Sri Lanka
room decor items Sri Lanka
Flamira Sri Lanka
Flamira gifts Colombo
birthday gift delivery Colombo
housewarming gift ideas Sri Lanka
customized couple gifts Sri Lanka
```



---

# 📱 Mobile-First Design

The primary audience accesses Flamira through mobile devices and social-media in-app browsers.

The UI therefore prioritizes:

- Mobile-first layouts
- Large tap targets
- Fast loading
- Optimized product images
- Minimal checkout fields
- Persistent cart access
- Clear pricing
- Visible delivery charges
- COD visibility
- WhatsApp fallback

Product photography and visual presentation are particularly important because Flamira's products are aesthetic and gift-oriented.

---

# 📧 Notifications

The system supports transactional emails for:

### Customer

- Order confirmation
- Dispatch notification
- Cancellation notification

### Owner

- New order notification
- Low-stock notification
- Optional secondary WhatsApp/Telegram alert

Email sending is designed to run asynchronously through Firebase Cloud Functions so an email-provider outage does not block checkout.

---

# 💳 Payment

## Launch Payment Method

**Cash on Delivery (COD)** is the primary payment method at launch.

The checkout is designed so that additional payment methods can be introduced later without rebuilding the entire order system.

Potential future integrations include:

- PayHere
- WebXPay
- Stripe
- PayPal
- Bank-transfer slip upload

The overseas gifting market is a potential future segment because international customers cannot use COD.

---

# 🛠️ Local Development

## Prerequisites

Install:

- Node.js 18+
- npm / pnpm / yarn
- Firebase project
- Git

## Clone Repository

```bash
git clone <repository-url>
cd flamira
```

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

NEXT_PUBLIC_META_PIXEL_ID=
META_CONVERSIONS_API_TOKEN=

NEXT_PUBLIC_TIKTOK_PIXEL_ID=
TIKTOK_EVENTS_API_TOKEN=

NEXT_PUBLIC_GA_ID=

BREVO_API_KEY=
```

> Never commit `.env.local` or Firebase Admin credentials to source control.

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📁 Suggested Project Structure

```text
flamira/
│
├── app/
│   ├── page.tsx
│   ├── shop/
│   ├── category/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── order/
│   ├── track/
│   ├── about/
│   ├── contact/
│   ├── custom/
│   └── admin/
│
├── components/
│   ├── ui/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── layout/
│   └── admin/
│
├── lib/
│   ├── firebase/
│   ├── auth/
│   ├── orders/
│   ├── products/
│   ├── analytics/
│   └── validation/
│
├── functions/
│
├── public/
│
├── types/
│
├── hooks/
│
├── utils/
│
├── firestore.rules
├── firestore.indexes.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

# 🚢 Deployment

The recommended hosting architecture is:

```text
Customer
   │
   ▼
Vercel
   │
   ├── Next.js Storefront
   ├── API Routes
   └── Server Actions
          │
          ▼
      Firebase
       ├── Firestore
       ├── Storage
       ├── Authentication
       └── Cloud Functions
```

Vercel provides CDN delivery, HTTPS, and deployment infrastructure while Firebase handles application data, authentication, storage, and event-driven backend tasks.

---

# 🗓️ Development Roadmap

## Phase 1 — Discovery & Setup

**Week 1**

- Client requirements
- Product data collection
- Asset audit
- Firebase setup
- Vercel setup
- Repository setup
- Design system
- Wireframes

## Phase 2 — Database & Admin

**Weeks 2–3**

- Firestore schema
- Security rules
- Admin authentication
- Product management
- Category management
- Settings

## Phase 3 — Storefront

**Weeks 3–5**

- Homepage
- Shop
- Categories
- Product pages
- Search
- Filters
- Cart
- Responsive UI

## Phase 4 — Checkout & Orders

**Weeks 5–6**

- Guest checkout
- COD
- OTP verification
- Delivery calculation
- Stock transactions
- Order creation
- Order tracking
- Admin order management

## Phase 5 — Integrations & Optimization

**Week 7**

- Email notifications
- Meta Pixel
- Meta Conversions API
- TikTok Pixel
- TikTok Events API
- GA4
- SEO
- Performance optimization

## Phase 6 — Content & Launch

**Week 8**

- Catalogue upload
- Policies
- UAT
- Device testing
- Owner training
- Documentation
- DNS configuration
- Production launch

The planned implementation timeline is approximately **8 weeks**, assuming product information and imagery are provided on schedule.

---

# 📋 Launch Checklist

### Business

- [ ] Confirm active product list
- [ ] Confirm product prices
- [ ] Confirm stock quantities
- [ ] Confirm delivery charges
- [ ] Confirm courier
- [ ] Confirm return/exchange policy
- [ ] Confirm made-to-order products
- [ ] Confirm personalization lead times
- [ ] Confirm payment methods
- [ ] Confirm domain name
- [ ] Confirm business email

### Branding

- [ ] Logo
- [ ] Brand colours
- [ ] Fonts
- [ ] Product photography
- [ ] Brand story
- [ ] Social-media links

### Technical

- [ ] Firebase project
- [ ] Vercel project
- [ ] Production environment variables
- [ ] Firestore security rules
- [ ] Firebase Storage
- [ ] Admin authentication
- [ ] Meta Pixel
- [ ] TikTok Pixel
- [ ] GA4
- [ ] Search Console
- [ ] Transactional email
- [ ] Domain & DNS

### Content

- [ ] Product titles
- [ ] Product descriptions
- [ ] Product images
- [ ] Product videos
- [ ] SEO metadata
- [ ] Delivery policy
- [ ] Returns policy
- [ ] Privacy policy
- [ ] Terms of service
- [ ] FAQ

---

# ⚠️ Known Risks

### Product Data Dependency

Incomplete product information can delay launch.

### COD Fraud

Fake COD orders can create courier and fulfilment costs.

**Mitigation:** OTP verification, rate limiting, confirmation calls, and failed-delivery tracking.

### Stock Race Conditions

Multiple customers may attempt to purchase the same product simultaneously.

**Mitigation:** Firestore transactions.

### Email Deliverability

Unauthenticated domains may cause transactional emails to be classified as spam.

**Mitigation:** SPF, DKIM, DMARC, authenticated sending domain, and delivery logs.

### Media Performance

Large product images and social-media videos can negatively affect mobile performance.

**Mitigation:** automatic compression, WebP/AVIF conversion, lazy loading, and optimized video delivery.

### Firebase Costs

Unoptimized Firestore reads can become expensive as traffic increases.

**Mitigation:** pagination, ISR caching, aggregation counters, indexed queries, and billing alerts.



---

# 🔮 Future Enhancements

Potential future improvements include:

- Online card payments
- Overseas gifting checkout
- Sinhala-language storefront
- Customer accounts
- Wishlist
- Product notifications
- Advanced search
- Algolia / Typesense integration
- Loyalty program
- Gift cards
- Subscription candle boxes
- Automated WhatsApp notifications
- Courier API integration
- Advanced customer segmentation
- Abandoned-cart recovery
- Advanced marketing automation

---

# 📞 Business Information

**Business:** Flamira  
**Business Type:** Handmade candles, home décor & gifting  
**Primary Market:** Sri Lanka  
**Primary Sales Channels:** Facebook & TikTok  
**Primary Launch Payment:** Cash on Delivery  

### Social Media

- Facebook: https://www.facebook.com/share/1GfuMD9JvL/
- TikTok: https://www.tiktok.com/@flamira11

The project research identifies Facebook and TikTok as important existing acquisition channels for Flamira.

---

# 📄 Project Status

**Status:** 🟡 Planning / Development

**Planned Platform:** Next.js + Firebase  
**Deployment:** Vercel  
**Database:** Cloud Firestore  
**Authentication:** Firebase Authentication  
**Storage:** Firebase Storage  
**Checkout:** Guest COD  
**Admin Panel:** Custom  
**Target:** Mobile-first e-commerce

---

## ❤️ Built for Flamira

The goal of the Flamira platform is simple:

> **Turn every social-media discovery into a simple, trustworthy, measurable shopping experience.**

From discovering a candle on TikTok or Facebook to receiving it at home, Flamira's website is designed to make the entire journey faster, clearer, and easier — while giving the business owner the tools needed to grow beyond manual chat-based selling.
