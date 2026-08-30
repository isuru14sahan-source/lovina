# Lovina - Enterprise E-Commerce Platform

## AI Development Instruction Document

**Version:** 1.0
**Project:** Lovina
**Platform Type:** Premium Imitation Jewellery & Fashion Accessories E-Commerce Platform

---

# 1. Project Introduction

## 1.1 Project Name

Lovina

---

## 1.2 Project Overview

Lovina is a premium online e-commerce platform designed for selling high-quality imitation jewellery and fashion accessories for both women and men.

The platform must provide a luxury shopping experience with a modern, elegant, responsive, and user-friendly interface.

The system should support:

* Product browsing
* Product searching
* Category management
* Shopping cart
* Wishlist
* Secure checkout
* Order management
* Customer accounts
* Admin management
* Inventory management
* Promotions
* Reviews and ratings

The platform should be designed as a scalable commercial product capable of expanding from Sri Lanka to international markets.

---

# 2. Core Development Philosophy

The development process must follow enterprise software engineering principles.

The AI development agent must always prioritize:

## 2.1 Quality First

Every component, feature, and module must be production-ready.

Avoid:

* Temporary solutions
* Hardcoded values
* Duplicate logic
* Poor architecture
* Unnecessary complexity

---

## 2.2 Scalability

The system must be designed for future growth.

The architecture should support:

* More customers
* More products
* More categories
* Multiple sellers (future)
* International expansion
* Multiple currencies
* Multiple languages

---

## 2.3 Maintainability

The codebase must be easy to understand and maintain.

Follow:

* Clean architecture
* Modular structure
* Separation of concerns
* Reusable components
* Clear naming conventions

---

# 3. Development Rules

## 3.1 General Rules

The AI agent must:

* Understand requirements before implementation
* Create reusable solutions
* Follow industry standards
* Avoid unnecessary dependencies
* Write clean and readable code
* Keep components independent
* Maintain consistent structure

---

## 3.2 Feature Development Process

Every feature must follow this workflow:

```
Requirement Analysis

↓

Architecture Planning

↓

Database Planning

↓

UI Design

↓

Implementation

↓

Testing

↓

Optimization

↓

Documentation
```

No feature should be implemented without considering:

* User experience
* Security
* Performance
* Scalability

---

# 4. Brand Identity Rules

## 4.1 Brand Name

The official brand name is:

```
Lovina
```

The AI must always use:

Lovina

as the primary brand identity.

---

## 4.2 Brand Personality

Lovina represents:

* Luxury
* Elegance
* Beauty
* Confidence
* Modern Fashion
* Premium Lifestyle

---

## 4.3 Design Direction

The website design must follow:

* Luxury fashion style
* Minimal design
* Premium feeling
* Clean layouts
* High-quality visuals

Avoid:

* Cheap-looking designs
* Overcrowded layouts
* Excessive animations
* Unprofessional colours

---

# 5. UI/UX Design Rules

## 5.1 Overall Design Style

The user interface must feel similar to premium fashion brands.

Design inspiration:

* Luxury fashion websites
* Modern e-commerce platforms
* High-end jewellery stores

---

## 5.2 Layout Principles

Every page should follow:

* Clear hierarchy
* Proper spacing
* Balanced alignment
* Simple navigation
* Mobile-first design

---

## 5.3 Responsive Design

The website must support:

* Desktop
* Laptop
* Tablet
* Mobile devices

Required breakpoints:

```
Mobile

Tablet

Desktop

Large Desktop
```

No page should break on different screen sizes.

---

# 6. Colour Guidelines

Primary Brand Colour:

```
Gold
```

Secondary:

```
Luxury Beige
```

Background:

```
White / Soft Neutral
```

Dark Theme:

```
Elegant Black
```

The colour usage must create a premium jewellery shopping experience.

---

# 7. Typography Rules

Typography must look elegant and professional.

Recommended:

## Headings

Luxury Serif Style

Example:

* Playfair Display

## Body Text

Modern Sans Serif

Example:

* Poppins
* Inter

---

# 8. Animation Guidelines

Animations should improve user experience.

Allowed:

* Smooth transitions
* Hover effects
* Product image animations
* Page transitions

Avoid:

* Heavy animations
* Distracting movements
* Slow loading effects

---

# 9. Frontend Architecture Rules

## 9.1 Technical Stack

* **Framework:** React / Next.js / Vite SPA
* **Language:** TypeScript for type safety across all components and data structures
* **Styling:** Modular CSS / CSS Variables / Modern Design Tokens (Vanilla CSS tailored for Luxury aesthetics)
* **State Management:** React Context API / Zustand for global state (Cart, Wishlist, User Auth, Theme)
* **Icons:** Lucide Icons / Custom SVG luxury accents

## 9.2 Component Structure

Follow a strict atomic / feature-based directory architecture:

```
src/
├── assets/          # Static media, icons, fonts
├── components/
│   ├── ui/          # Low-level reusable UI primitives (Buttons, Inputs, Modals, Badges)
│   ├── common/      # App header, footer, navigation, search bar
│   ├── product/     # Product cards, image gallery, variant selectors, reviews
│   ├── cart/        # Cart drawer, item row, order summary
│   └── admin/       # Data tables, stat cards, product forms
├── pages/           # Page views (Home, Shop, ProductDetail, Cart, Checkout, Account, Admin)
├── context/         # Auth, Cart, Wishlist, Toast Context providers
├── hooks/           # Custom React hooks (useCart, useAuth, useProducts, useWindowSize)
├── services/        # API client modules, data fetchers
├── utils/           # Formatters (currency, dates), validators, constants
└── styles/          # Design system tokens, global CSS, typography
```

## 9.3 State Management Guidelines

* **Local Component State:** Keep UI toggle states (e.g. dropdown open, tab selection) local to components.
* **Global App State:** Store user sessions, cart items, wishlist items, and notifications in centralized stores/contexts.
* **Persistence:** Synchronize cart and wishlist states with `localStorage` for guest users and server database for logged-in users.

---

# 10. Backend Architecture Rules

## 10.1 Technical Stack

* **Runtime:** Node.js (v18+)
* **Framework:** Express.js / NestJS (RESTful API architecture)
* **Language:** TypeScript
* **ORM / Database Driver:** Mongoose (MongoDB) or Prisma / TypeORM (PostgreSQL)

## 10.2 Layered Architecture

Strict separation of concerns must be enforced:

```
src/
├── config/          # Environment vars, database connections, app constants
├── controllers/     # HTTP request handling & response sending
├── services/        # Core business logic & workflows
├── repositories/   # Direct database queries & data mappers
├── models/          # Schema definitions & TypeScript interfaces
├── middlewares/     # Auth, error handling, validation, rate-limiting
├── routes/          # API Endpoint route declarations
└── utils/           # Password hashing, JWT helpers, email senders
```

---

# 11. Database Rules & Schema Guidelines

## 11.1 Key Entities & Schema Models

1. **Users:** `_id`, `name`, `email`, `passwordHash`, `role` (customer | admin), `phone`, `addresses`, `createdAt`
2. **Products:** `_id`, `name`, `slug`, `sku`, `description`, `price`, `discountPrice`, `category`, `subCategory`, `images` (array), `variants` (color, size/length), `stockQuantity`, `attributes` (material, plating, gemstone), `isFeatured`, `rating`, `numReviews`, `createdAt`
3. **Categories:** `_id`, `name`, `slug`, `image`, `description`, `parentCategory`
4. **Cart:** `userId`, `items` (`productId`, `variantId`, `quantity`, `price`), `totalAmount`
5. **Orders:** `_id`, `orderNumber`, `user`, `orderItems`, `shippingAddress`, `paymentMethod`, `paymentResult`, `taxPrice`, `shippingPrice`, `totalPrice`, `orderStatus` (Pending | Processing | Shipped | Delivered | Cancelled), `deliveredAt`, `createdAt`
6. **Reviews:** `_id`, `product`, `user`, `rating`, `comment`, `images`, `createdAt`
7. **Wishlist:** `userId`, `products` (array of product IDs)

---

# 12. Security Standards

## 12.1 Data Protection & Encryption

* **Passwords:** Hashed using `bcryptjs` / `argon2` with high work factor (salt rounds >= 10).
* **Tokens:** Signed JSON Web Tokens (JWT) for authentication with short expiry times (15m access token, 7d refresh token).
* **Cookies:** Store sensitive tokens in `HttpOnly`, `SameSite=Strict`, `Secure` cookies.

## 12.2 API & Server Security

* **Rate Limiting:** Protect public routes against brute-force attacks (`express-rate-limit`).
* **Input Sanitation:** Validate all payloads against schema validators (e.g. `Zod` or `Joi`). Prevent SQL / NoSQL injections and XSS attacks.
* **HTTP Headers:** Enforce security headers via `helmet`.
* **CORS:** Restrict origin requests exclusively to trusted frontend domains.

---

# 13. Authentication & Authorization Rules

## 13.1 Authentication Workflow

* Support Email/Password registration & login.
* Password reset mechanism via secure time-limited email tokens.
* Guest Checkout functionality with option to convert to full account post-checkout.

## 13.2 Role-Based Access Control (RBAC)

* **Customer Role:** Access personal profile, active orders, cart, wishlist, product reviews.
* **Admin Role:** Full administrative access to product catalog, order management, customer analytics, inventory updates, and promotional banners.
* Protect all `/api/v1/admin/*` routes with admin verification middleware.

---

# 14. API Rules & Standards

## 14.1 RESTful Endpoint Conventions

* Base URL: `/api/v1`
* Endpoint Naming: Plural nouns (e.g., `/api/v1/products`, `/api/v1/orders`)

## 14.2 Standard Response Format

All API responses must follow a unified structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 48
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

---

# 15. Admin Panel Rules

## 15.1 Admin Dashboard Features

* **Overview Dashboard:** Total Revenue, Total Orders, Active Customers, Low Stock Alerts, Sales Analytics Chart.
* **Catalog Management:** Create/Edit/Delete Products with dynamic variant management, multi-image upload & drag-and-drop ordering.
* **Category Manager:** Hierarchy management (Categories & Subcategories with banners).
* **Order Management:** Filter orders by status, detail view, invoice generation, status update dispatch (Pending → Shipped → Delivered).
* **Customer Insights:** View customer details, order history, activity logs.

---

# 16. Product & Inventory Management Rules

## 16.1 Jewellery Attributes

Products must support detailed fashion jewellery specifications:

* **Material:** 18K Gold Plated, Rose Gold, 925 Sterling Silver, Stainless Steel, Brass.
* **Gemstone/Accent:** Cubic Zirconia, Freshwater Pearl, Austrian Crystal, Synthetic Gemstone.
* **Variant System:** Color variants (Gold, Silver, Rose Gold) and Size variants (Rings: 6,7,8,9; Chains: 16", 18", 20").
* **Stock Control:** Real-time stock decrement upon order authorization; out-of-stock badges and pre-order settings.

---

# 17. SEO & Analytics Rules

* **Metadata:** Dynamic titles, meta descriptions, Open Graph (OG) tags, and Twitter Cards for every product and category page.
* **Structured Data:** Include Schema.org `Product`, `Offer`, `BreadcrumbList`, and `Organization` JSON-LD data for rich search engine snippets.
* **URLs:** Clean, readable slugs (e.g., `/product/18k-gold-plated-pendant-necklace`).
* **Sitemap:** Automated `sitemap.xml` and `robots.txt` generation.

---

# 18. Performance Optimization Rules

* **Images:** All images formatted in WebP/AVIF format with responsive sizes (`srcset`), explicit dimensions to prevent layout shifts (CLS), and lazy loading (`loading="lazy"`).
* **Bundle Optimization:** Code splitting with React `lazy` & dynamic `import()`.
* **Caching:** Cache static assets, API responses for immutable catalog data.

---

# 19. Quality Assurance & Testing Rules

* **Linting & Formatting:** ESLint & Prettier configured with strict rule sets.
* **Component Testing:** Test core UI elements and calculations (e.g., cart total math, discount code application).
* **End-to-End Flow:** Validate critical user journey: Product Browsing → Add to Cart → Checkout → Order Confirmation.

---

# 20. Deployment & CI/CD Guidelines

* **Environment Configuration:** All credentials (database URI, JWT secrets, payment API keys, Cloudinary/AWS S3 keys) stored strictly in `.env` files.
* **Production Build:** Validate clean build without TypeScript errors or broken imports prior to release.
* **Deployment Targets:** Vercel / Netlify for Frontend, Render / Railway / AWS / DigitalOcean for Backend API.

