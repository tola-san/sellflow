import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BusinessPage } from "./pages/BusinessPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ThemePage } from "./pages/ThemePage";
import { StorefrontPage } from "./pages/StorefrontPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartDrawer } from "./pages/CartPage";        // ← Make sure this exports CartDrawer
import { CheckoutPage } from "./pages/CheckoutPage";
import { TelegramNotificationsPage } from "./pages/TelegramNotificationsPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { GuestRoute } from "./components/Auth/GuestRoute";
import { AuthProvider } from "./components/Auth/AuthContext";
import { ToastProvider } from "./components/ui/ToastContext";
import { CartProvider } from "./components/cart/CartContext";
import { TelegramMiniAppLayout } from "./components/telegram/TelegramMiniAppLayout";
import { TelegramStoreEntryPage } from "./pages/TelegramStoreEntryPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AddOnsPage } from "./pages/AddOnsPage";
import { MenuAvailabilityPage } from "./pages/MenuAvailabilityPage";
import { RestaurantTablesPage } from "./pages/RestaurantTablesPage";
import { useTelegramMiniApp } from "./components/telegram/TelegramMiniAppContext";

const OrdersPage = lazy(() => import("./pages/OrdersPage").then((module) => ({ default: module.OrdersPage })));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage").then((module) => ({ default: module.AnalyticsPage })));

function CartRoute() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const { storePath } = useTelegramMiniApp();

    return (
        <CartDrawer
            isOpen={true}
            onClose={() => navigate(slug ? storePath(slug) : "/")}
        />
    );
}

export function App() {
    return (
        <ToastProvider>
            <CartProvider>
                <AuthProvider>
                    <Routes>
                        <Route element={<GuestRoute />}>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/register" element={<LandingPage />} />
                        </Route>

                        <Route element={<ProtectedRoute />}>
                            <Route path="/onboarding" element={<OnboardingPage />} />
                            <Route path="/dashboard" element={<DashboardLayout />}>
                                <Route index element={<DashboardPage />} />
                                <Route path="business" element={<BusinessPage />} />
                                <Route path="categories" element={<CategoriesPage />} />
                                <Route path="products" element={<ProductsPage />} />
                                <Route path="add-ons" element={<AddOnsPage />} />
                                <Route path="menu-availability" element={<MenuAvailabilityPage />} />
                                <Route path="restaurant-tables" element={<RestaurantTablesPage />} />
                                <Route path="theme" element={<ThemePage />} />
                                <Route path="orders" element={<Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading orders...</div>}><OrdersPage /></Suspense>} />
                                <Route path="analytics" element={<Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading analytics...</div>}><AnalyticsPage /></Suspense>} />
                                <Route path="notifications" element={<TelegramNotificationsPage />} />
                            </Route>
                        </Route>

                        {/* Customer Store Routes */}
                        <Route path="/:slug/cart" element={<CartRoute />} />
                        <Route path="/:slug/checkout" element={<CheckoutPage />} />
                        <Route path="/:slug/products/:productSlug" element={<ProductDetailPage />} />
                        <Route path="/:slug" element={<StorefrontPage />} />

                        {/* Telegram customer Mini App routes */}
                        <Route path="/telegram/store" element={<TelegramStoreEntryPage />} />
                        <Route path="/telegram/store/:slug" element={<TelegramMiniAppLayout />}>
                            <Route index element={<StorefrontPage />} />
                            <Route path="products/:productSlug" element={<ProductDetailPage />} />
                            <Route path="cart" element={<CartRoute />} />
                            <Route path="checkout" element={<CheckoutPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </CartProvider>
        </ToastProvider>
    );
}
