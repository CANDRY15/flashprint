import Header from "@/components/Layout/Header";
import AdminHeader from "@/components/Layout/AdminHeader";
import Footer from "@/components/Layout/Footer";
import HeroSection from "@/components/Sections/HeroSection";
import ServicesSection from "@/components/Sections/ServicesSection";
import LibrarySection from "@/components/Sections/LibrarySection";
import AboutSection from "@/components/Sections/AboutSection";
import ContactSection from "@/components/Sections/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <LibrarySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
