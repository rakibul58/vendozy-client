import ProductDetailsPage from "@/components/modules/Products/ProductDetailsPage";
import { getProductById } from "@/services/ProductServices";

export default async function PostDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getProductById(id);

  return (
    <div>
      <ProductDetailsPage data={data} />
    </div>
  );
}
