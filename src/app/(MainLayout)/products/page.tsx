import ProductListing from "@/components/modules/Shared/ProductListing";

export default function page() {
  return (
    <div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Our Products</h2>
        <p className="text-muted-foreground mt-1">
          Our products all in one place for you
        </p>
      </div>
      <ProductListing />
    </div>
  );
}
