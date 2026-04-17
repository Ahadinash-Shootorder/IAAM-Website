

// "use client";

// import { useEffect, useState } from "react";
// import CategoryLayout from "@/components/Category/categoryLayout";

// export default function CategoriesPage() {
//   const [products, setProducts] = useState([]);
//   const [defaultSlug, setDefaultSlug] = useState(null);

//   useEffect(() => {
//     const init = async () => {
//       const catRes = await fetch("/api/categories");
//       const cats = await catRes.json();

//       if (cats.length > 0) {
//         const firstSlug = cats[0].slug;
//         setDefaultSlug(firstSlug);

//         const prodRes = await fetch(`/api/categories/${firstSlug}/products`);
//         const prodData = await prodRes.json();
//         setProducts(prodData);
//       }
//     };

//     init();
//   }, []);

//   if (!defaultSlug) return null;

//   return (
//     <>
//       <div>
//         <CategoryLayout activeSlug={defaultSlug} products={products} />
//       </div>
//     </>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import CategoryLayout from "@/components/Category/categoryLayout";

export default function CategoriesPage() {
  const [defaultSlug, setDefaultSlug] = useState(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((cats) => {
        if (cats.length > 0) {
          setDefaultSlug(cats[0].slug);
        }
      });
  }, []);

  if (!defaultSlug) return null;

  return <CategoryLayout initialSlug={defaultSlug} />;
}

