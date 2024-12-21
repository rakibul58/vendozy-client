import ShopPage from "@/components/modules/Shop/ShopPage";
import { getVendorById } from "@/services/VendorServices";

export default async function Shop({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getVendorById(id);

  return (
    <div>
      <ShopPage shop={data} />
    </div>
  );
}
