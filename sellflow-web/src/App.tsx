import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AuthProvider } from "./components/AuthContext";

export function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                />
            </Routes>
        </AuthProvider>
    );
}
