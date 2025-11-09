import Header from "@/components/Layout/Header";
import AdminHeader from "@/components/Layout/AdminHeader";
import Footer from "@/components/Layout/Footer";
import HeroSection from "@/components/Sections/HeroSection";
import ServicesSection from "@/components/Sections/ServicesSection";
import LibrarySection from "@/components/Sections/LibrarySection";
import AboutSection from "@/components/Sections/AboutSection";
import ContactSection from "@/components/Sections/ContactSection";
import AdSense from "@/components/AdSense";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <Header />
      <main>
        <HeroSection />
        
        {/* AdSense - Top Banner */}
        <div className="container mx-auto px-4 py-8">
          <AdSense slot="1234567890" format="horizontal" className="max-w-4xl mx-auto" />
        </div>
        
        <ServicesSection />
        
        {/* AdSense - Mid Content */}
        <div className="container mx-auto px-4 py-8">
          <AdSense slot="2345678901" format="rectangle" className="max-w-4xl mx-auto" />
        </div>
        
        <LibrarySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
