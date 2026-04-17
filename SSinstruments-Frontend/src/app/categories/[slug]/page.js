
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CategoryLayout from "@/components/Category/categoryLayout";

export default function CategorySlugPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!params?.slug) return;

    const fetchProducts = async () => {
      const res = await fetch(`/api/categories/${params.slug}/products`);
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, [params?.slug]);

  return <CategoryLayout initialSlug={params?.slug} products={products} />;
}
