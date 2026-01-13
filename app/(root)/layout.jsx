import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import PromoButton from "@/components/shared/PromoButton"


export default function RootLayout({ children }) {
    return (
        <section lang="en">
            <PromoButton />
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </section>
    );
}
