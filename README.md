# SellFlow

> Free and open-source storefront and order-management platform for small businesses.

SellFlow lets business owners publish a branded product catalog through a unique
store URL. Customers can browse products and place orders without creating an
account, while owners manage their catalog, inventory, orders, payments, themes,
and Telegram notifications from a private dashboard.

## Current Status

SellFlow has reached the MVP stabilization stage. The main selling workflow is
implemented end to end:

`Create store -> Add catalog -> Publish storefront -> Customer checkout -> Manage order`

The current priority is to make this workflow release-ready before expanding the
product with automated payments and advanced features.

## Implemented

### Platform and authentication

- [x] Laravel 12 REST API
- [x] React and Vite frontend
- [x] Sanctum registration, login, logout, and current-user session
- [x] Protected dashboard and public customer routes
- [x] Business ownership and tenant isolation
- [x] Guided store-owner onboarding after registration
- [x] Shared dashboard modules with business-type module presets

### Business and catalog

- [x] Business profile, contact details, social links, logo, and banner
- [x] Business-type selection and profile editing
- [x] Category CRUD and storefront visibility
- [x] Product CRUD, search, pagination, pricing, discounts, and inventory
- [x] Product image upload with persistent Cloudinary storage support
- [x] Low-stock and out-of-stock handling

### Storefront and checkout

- [x] Public storefront using a business slug
- [x] Public categories and product detail pages
- [x] Shopping cart and checkout
- [x] Cash and Bakong payment-method selection
- [x] Server-side price, stock, and tenant validation
- [x] Responsive customer experience and Telegram Mini App routes

### Orders and dashboard

- [x] Orders and order items
- [x] Order search, filters, pagination, and details
- [x] Controlled order-status and payment-status transitions
- [x] Revenue, order, product, category, and low-stock summaries
- [x] Dashboard charts and recent activity

### Themes and notifications

- [x] Dashboard appearance customization
- [x] Storefront theme, color, font, and layout customization
- [x] Theme support on the storefront, product, cart, and checkout pages
- [x] Telegram seller, staff-group, and customer-group connections
- [x] New-order, receipt, order-status, and payment-status messages
- [x] Secure Telegram order linking and customer updates

### Deployment

- [x] Dockerized Laravel API
- [x] Render API and PostgreSQL configuration
- [x] Vercel SPA and API proxy configuration
- [x] Database migrations during deployment
- [x] Basic GitHub Actions frontend workflow
- [x] Production health-check route

## Current Workflow

### 1. Stabilize the MVP — Current

- [ ] Add an ESLint 9 flat configuration and make linting pass
- [ ] Enable PDO SQLite locally so the Laravel feature suite can run
- [ ] Add Laravel tests to GitHub Actions
- [ ] Add frontend tests for authentication, cart, and checkout
- [ ] Add an end-to-end seller-to-customer checkout test
- [ ] Verify migrations against PostgreSQL
- [ ] Verify Cloudinary uploads, queues, CORS, and Telegram webhooks in production
- [ ] Reconcile the feature branch with `main` and create a stable release

### 2. Complete Bakong/KHQR payments — Next

- [ ] Add per-business Bakong account configuration
- [ ] Generate a dynamic KHQR for the exact order amount
- [ ] Store a unique payment reference on each order
- [ ] Verify payments through a secure callback or polling workflow
- [ ] Protect against duplicate callbacks and duplicate payments
- [ ] Automatically change payment status from `pending` to `paid`
- [ ] Show a payment result and digital receipt to the customer
- [ ] Send automatic payment confirmation through Telegram

### 3. Customer order tracking

- [ ] Add a secure public order-tracking URL
- [ ] Show the order, payment, and fulfillment timeline
- [ ] Let customers reopen or download their receipt
- [ ] Connect website tracking links with Telegram order linking

### 4. Store sharing and QR

- [ ] Generate a QR code for each public storefront
- [ ] Add copy-link, share, and QR-download actions
- [ ] Add printable QR assets for counters, tables, and packaging
- [ ] Add dynamic SEO and social-sharing metadata

### 5. Account security and recovery

- [ ] Email verification
- [ ] Forgot-password and reset-password flow
- [ ] Profile and password settings UI
- [ ] Session/device management
- [ ] Authentication rate-limit and security review

### 6. Advanced analytics

- [ ] Date-range filtering
- [ ] Sales and order trends
- [ ] Best-selling products and categories
- [ ] Customer and repeat-order insights
- [ ] CSV export and printable reports

### 7. Product variants and inventory

- [ ] Sizes, colors, and other product options
- [ ] Variant-specific price, SKU, image, and stock
- [ ] Stock adjustment history
- [ ] Low-stock notification preferences

### 8. Subscription module — Later

- [ ] Plans and feature limits
- [ ] Trials and expiration rules
- [ ] Subscription checkout and billing history
- [ ] Plan-aware middleware and upgrade prompts

### Future improvements

- [ ] Email notifications
- [ ] Web push notifications
- [ ] Custom domains
- [ ] Localization and multi-currency support
- [ ] Accessibility audit
- [ ] Performance and SEO audit

## Technology

### Backend

- PHP 8.2+
- Laravel 12
- Laravel Sanctum
- PostgreSQL
- Cloudinary

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion

### Operations

- Docker
- Render
- Vercel
- GitHub Actions
- Telegram Bot API

## Definition of MVP Release

The MVP is ready to release when:

- [ ] Frontend lint and production build pass in CI
- [ ] Laravel feature tests pass in CI
- [ ] A seller can complete onboarding without manual database changes
- [ ] A customer can browse, add to cart, and place an order on mobile
- [ ] Stock and totals remain correct during checkout
- [ ] The seller receives and manages the order successfully
- [ ] The customer receives order updates successfully
- [ ] Production logging, queues, storage, and health checks are verified
