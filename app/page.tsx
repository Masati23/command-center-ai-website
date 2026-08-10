import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import TrustSecurity from "@/components/TrustSecurity";
import WhyChooseUs from "@/components/WhyChooseUs";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <TrustSecurity />
        <WhyChooseUs />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
