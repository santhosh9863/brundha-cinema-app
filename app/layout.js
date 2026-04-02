import "./globals.css";
import Navbar from "../components/Navbar";
import CursorGlow from "../components/CursorGlow";
import Footer from "../components/Footer";
import ParallaxBackground from "../components/ParallaxBackground";
import { BookingProvider } from "./context/BookingContext";
import { SoundProvider } from "../components/SoundProvider";
import Spotlight from "../components/Spotlight";
import Particles from "../components/Particles";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <BookingProvider>
          <SoundProvider>
            <ParallaxBackground />
            <Particles />
            <Spotlight />
            <CursorGlow />
            <Navbar />

            <div className="pt-16 sm:pt-20 relative z-10 min-h-screen">
              {children}
              <Footer />
            </div>

          </SoundProvider>
        </BookingProvider>
      </body>
    </html>
  );
}