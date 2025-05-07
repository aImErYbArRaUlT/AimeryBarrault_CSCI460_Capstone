import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import DownloadSection from './components/DownloadSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <DownloadSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}