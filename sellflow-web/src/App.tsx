import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BusinessPage } from "./pages/BusinessPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ThemePage } from "./pages/ThemePage";
import { StorefrontPage } from "./pages/StorefrontPage";
import { CartDrawer } from "./pages/CartPage";        // ← Make sure this exports CartDrawer
import { CheckoutPage } from "./pages/CheckoutPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { GuestRoute } from "./components/Auth/GuestRoute";
import { AuthProvider } from "./components/Auth/AuthContext";
import { ToastProvider } from "./components/ui/ToastContext";
import { CartProvider } from "./components/cart/CartContext";

const OrdersPage = lazy(() => import("./pages/OrdersPage").then((module) => ({ default: module.OrdersPage })));

function CartRoute() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    return (
        <CartDrawer
            isOpen={true}
            onClose={() => navigate(slug ? `/${slug}` : "/")}
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
                            <Route path="/dashboard" element={<DashboardLayout />}>
                                <Route index element={<DashboardPage />} />
                                <Route path="business" element={<BusinessPage />} />
                                <Route path="categories" element={<CategoriesPage />} />
                                <Route path="products" element={<ProductsPage />} />
                                <Route path="theme" element={<ThemePage />} />
                                <Route path="orders" element={<Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading orders...</div>}><OrdersPage /></Suspense>} />
                            </Route>
                        </Route>

                        {/* Customer Store Routes */}
                        <Route path="/:slug/cart" element={<CartRoute />} />
                        <Route path="/:slug/checkout" element={<CheckoutPage />} />
                        <Route path="/:slug" element={<StorefrontPage />} />
                    </Routes>
                </AuthProvider>
            </CartProvider>
        </ToastProvider>
    );
}
