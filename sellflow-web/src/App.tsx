import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BusinessPage } from "./pages/BusinessPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ProductsPage } from "./pages/ProductsPage";
import { StorefrontPage } from "./pages/StorefrontPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { GuestRoute } from "./components/Auth/GuestRoute";
import { AuthProvider } from "./components/Auth/AuthContext";
import { ToastProvider } from "./components/ui/ToastContext";

export function App() {
    return (
        <ToastProvider>
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
                    </Route>
                </Route>

                {/* Keep this dynamic customer route after all system routes. */}
                <Route path="/:slug" element={<StorefrontPage />} />
            </Routes>
        </AuthProvider>
        </ToastProvider>
    );
}
