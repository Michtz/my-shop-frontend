import ProductOverview from '@/app/components/ProductOverview';

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  // Hier kommt deine Logik zum Abrufen der Produktdaten
  // z.B. API-Call oder Datenbankabfrage
}

export default async function ProductPage({ params }: ProductPageProps) {
  return (
    <>
      <ProductOverview id={params.id} />
    </>
  );
}
