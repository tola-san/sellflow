import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { GuestRoute } from "./components/Auth/GuestRoute";
import { AuthProvider } from "./components/Auth/AuthContext";
import { ToastProvider } from "./components/ui/ToastContext";
import { CartProvider } from "./components/cart/CartContext";
import { useTelegramMiniApp } from "./components/telegram/TelegramMiniAppContext";
import { DashboardLoading } from "./components/dashboard/DashboardLoading";

const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout").then((module) => ({ default: module.DashboardLayout })));
const TelegramMiniAppLayout = lazy(() => import("./components/telegram/TelegramMiniAppLayout").then((module) => ({ default: module.TelegramMiniAppLayout })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const BusinessPage = lazy(() => import("./pages/BusinessPage").then((module) => ({ default: module.BusinessPage })));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage").then((module) => ({ default: module.CategoriesPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage").then((module) => ({ default: module.ProductsPage })));
const InventoryPage = lazy(() => import("./pages/InventoryPage").then((module) => ({ default: module.InventoryPage })));
const ProductVariantsPage = lazy(() => import("./pages/ProductVariantsPage").then((module) => ({ default: module.ProductVariantsPage })));
const AddOnsPage = lazy(() => import("./pages/AddOnsPage").then((module) => ({ default: module.AddOnsPage })));
const MenuAvailabilityPage = lazy(() => import("./pages/MenuAvailabilityPage").then((module) => ({ default: module.MenuAvailabilityPage })));
const RestaurantTablesPage = lazy(() => import("./pages/RestaurantTablesPage").then((module) => ({ default: module.RestaurantTablesPage })));
const ThemePage = lazy(() => import("./pages/ThemePage").then((module) => ({ default: module.ThemePage })));
const OrdersPage = lazy(() => import("./pages/OrdersPage").then((module) => ({ default: module.OrdersPage })));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage").then((module) => ({ default: module.AnalyticsPage })));
const BillingPage = lazy(() => import("./pages/BillingPage").then((module) => ({ default: module.BillingPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const TelegramNotificationsPage = lazy(() => import("./pages/TelegramNotificationsPage").then((module) => ({ default: module.TelegramNotificationsPage })));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage").then((module) => ({ default: module.NotificationsPage })));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage").then((module) => ({ default: module.OnboardingPage })));
const StorefrontPage = lazy(() => import("./pages/StorefrontPage").then((module) => ({ default: module.StorefrontPage })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then((module) => ({ default: module.ProductDetailPage })));
const CartDrawer = lazy(() => import("./pages/CartPage").then((module) => ({ default: module.CartDrawer })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then((module) => ({ default: module.CheckoutPage })));
const TelegramStoreEntryPage = lazy(() => import("./pages/TelegramStoreEntryPage").then((module) => ({ default: module.TelegramStoreEntryPage })));

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
                    <Suspense fallback={<DashboardLoading message="Loading page..." />}>
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
                                <Route path="products/:productUuid/edit" element={<ProductsPage />} />
                                <Route path="inventory" element={<InventoryPage />} />
                                <Route path="product-variants" element={<ProductVariantsPage />} />
                                <Route path="add-ons" element={<AddOnsPage />} />
                                <Route path="menu-availability" element={<MenuAvailabilityPage />} />
                                <Route path="restaurant-tables" element={<RestaurantTablesPage />} />
                                <Route path="theme" element={<ThemePage />} />
                                <Route path="orders" element={<OrdersPage />} />
                                <Route path="orders/:orderUuid" element={<OrdersPage />} />
                                <Route path="analytics" element={<AnalyticsPage />} />
                                <Route path="billing" element={<BillingPage />} />
                                <Route path="settings" element={<SettingsPage />} />
                                <Route path="notifications" element={<TelegramNotificationsPage />} />
                                <Route path="activity" element={<NotificationsPage />} />
                            </Route>
                        </Route>

                        {/* Customer Store Routes */}
                        <Route path="/store/:slug/cart" element={<CartRoute />} />
                        <Route path="/store/:slug/checkout" element={<CheckoutPage />} />
                        <Route path="/store/:slug/products/:productSlug" element={<ProductDetailPage />} />
                        <Route path="/store/:slug" element={<StorefrontPage />} />

                        {/* Legacy storefront routes remain available for existing links. */}
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
                    </Suspense>
                </AuthProvider>
            </CartProvider>
        </ToastProvider>
    );
}
