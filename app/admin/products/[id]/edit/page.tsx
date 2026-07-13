import ProductFamilyForm from "@/components/admin/products/ProductFamilyForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductFamilyForm familyId={id} />;
}

