"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useTokenValidationInterval } from "@/hooks/useTokenValidator";

function DashboardLayoutWrapper({ children }) {
    // Validate token every minute (hook must be called at top level)
    useTokenValidationInterval(60000);

    return (
        <section>
            <Header />
            <DashboardLayout>
                {children}
            </DashboardLayout>
            <Footer />
        </section>
    );
}

export default function RootLayout({ children }) {
    return (
        <ProtectedRoute redirectTo="/login">
            <DashboardLayoutWrapper>
                {children}
            </DashboardLayoutWrapper>
        </ProtectedRoute>
    );
}
