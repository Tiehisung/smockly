// src/pages/Home.tsx

import { Bestsellers } from "../components/home/Bestsellers";
import { CategoryShowcase } from "../components/home/CategoryShowcase";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { HeroSection } from "../components/home/HeroSection";
import { NewArrivalsSection } from "../components/home/NewArrivalsSection";

export function Home() {
  return (
    <>
      <HeroSection /> 
      <NewArrivalsSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <Bestsellers />
    </>
  );
}
