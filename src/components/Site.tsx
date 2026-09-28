"use client";

import { BookingProvider } from "./booking/BookingContext";
import { BookingModal } from "./booking/BookingModal";
import { BrandIntro } from "./BrandIntro";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LevelProgress } from "./LevelProgress";
import { About } from "./About";
import { Goals } from "./Goals";
import { Pricing } from "./Pricing";
import { HowToStart } from "./HowToStart";
import { Reviews } from "./Reviews";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";

export function Site() {
  return (
    <BookingProvider>
      <BrandIntro />
      <Header />
      <main>
        <Hero />
        <LevelProgress />
        <About />
        <Goals />
        <Pricing />
        <HowToStart />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <BookingModal />
    </BookingProvider>
  );
}
