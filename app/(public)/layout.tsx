import FloatingButtons from "./components/shared/FloatingButtons";
import Footer from "./components/shared/Footer";
import Navbar from "./components/shared/Navbar";
import ScrollToTopButton from "./components/shared/ScrollToTop";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="min-h-screen flex flex-col justify-between"
      suppressHydrationWarning
    >
      <Navbar />
      {children}
      <FloatingButtons />
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}
