import CategoryList from "@/components/modules/Home/CategoryList";
import FlashSaleCTA from "@/components/modules/Home/FlashSaleCTA";
import HeroSection from "@/components/modules/Home/HeroSection";
import NewsletterSection from "@/components/modules/Home/NewsletterSection";
import RecentArrivals from "@/components/modules/Home/RecentArrivals";
import TopRatedProducts from "@/components/modules/Home/TopRated";
import WhyChooseUs from "@/components/modules/Home/WhyChooseUs";
import ProductListing from "@/components/modules/Shared/ProductListing";

export default function Home(){
  return (
    <div>
      <HeroSection />
      <CategoryList />
      <TopRatedProducts />
      <FlashSaleCTA />
      <ProductListing />
      <NewsletterSection />
      <RecentArrivals />
      <WhyChooseUs />
    </div>
  );
};