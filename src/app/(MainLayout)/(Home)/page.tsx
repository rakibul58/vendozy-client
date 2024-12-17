import CategoryList from "@/components/modules/Home/CategoryList";
import FlashSaleCTA from "@/components/modules/Home/FlashSaleCTA";
import HeroSection from "@/components/modules/Home/HeroSection";
import ProductListing from "@/components/modules/Shared/ProductListing";

export default function Home(){
  return (
    <div>
      <HeroSection />
      <CategoryList />
      <FlashSaleCTA />
      <ProductListing />
    </div>
  );
};