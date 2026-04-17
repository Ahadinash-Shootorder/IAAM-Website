const API = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://admin.iaamonline.org";

export async function getTopContentBySlug(slug: string) {
  const res = await fetch(`${API}/api/top-contents?filters[slug][$eq]=${slug}` +`&populate[HeroBanner][populate]=HeroBanner` +`&populate[Section][populate]=*`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json.data?.[0] || null;
}

// export async function getMainMenu() {
//   const res = await fetch(
//     `${API}/api/menu-sections` +
//       `?filters[MenuPlacement][$eq]=Primary` +
//       `&populate[Links][populate]=Sublinks` +
//       `&populate[LeftCard][populate]=Image`,
//     { cache: 'no-store' }
//   )

//   if (!res.ok) {
//     console.error('Main menu API failed')
//     return []
//   }

//   const json = await res.json()
//   return json.data || []
// }



export async function getMainMenu() {
  const res = await fetch(
    `${API}/api/menu-sections` +
      `?filters[MenuPlacement][$eq]=Primary` + 
      `&sort=OrderNo:asc` +
      `&populate[Links][populate]=Sublinks` +
      `&populate[LeftCard][populate]=Image`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    console.error('Main menu API failed')
    return []
  }

  const json = await res.json()
  return json.data || []
}




// export async function getTopMenu() {
//   try {
//     const res = await fetch(`${API}/api/top-menus`, {
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       console.error("TopMenu API failed:", res.status);
//       return { left: [], right: [] };
//     }

//     const json = await res.json();

//     const left: { label: string; href: string }[] = [];
//     const right: { label: string; href: string }[] = [];

//     for (const item of json.data || []) {
//       const link = {
//         label: item.LinkLabel,
//         href: item.LinkURL ? `/${item.LinkURL}` : "#",
//       };

//       if (item.Position === "Left") left.push(link);
//       if (item.Position === "Right") right.push(link);
//     }

//     return { left, right };
//   } catch (error) {
//     console.error("TopMenu fetch error:", error);
//     return { left: [], right: [] };
//   }
// }

export async function getTopMenu() {
  try {
    const res = await fetch(
      `${API}/api/top-menus?pagination[pageSize]=100`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("TopMenu API failed:", res.status);
      return { left: [], right: [] };
    }

    const json = await res.json();

    const left: { label: string; href: string }[] = [];
    const right: { label: string; href: string }[] = [];

    (json?.data || []).forEach((item: any) => {
      const slug = item?.LinkURL?.trim();

      const link = {
        label: item?.LinkLabel || "",
        href: slug ? `/${slug.replace(/^\/+/, "")}` : "#",
      };

      if (item?.Position === "Left") {
        left.push(link);
      } else if (item?.Position === "Right") {
        right.push(link);
      }
    });

    return { left, right };
  } catch (error) {
    console.error("TopMenu fetch error:", error);
    return { left: [], right: [] };
  }
}


export async function getHomeEventSection() {
  const res = await fetch(
    `${API}/api/home?populate[EventSection][populate][Eventinformation][populate]=Image`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    console.error('❌ Home EventSection API failed')
    return null
  }

  const json = await res.json()
  return json.data?.EventSection || null
}


export async function getAboutData() {
  try {
    const baseUrl = API?.replace(/\/$/, '') || 'http://admin.iaamonline.org';
    const strapiUrl = new URL(`${baseUrl}/api/home`);
    strapiUrl.searchParams.append("populate[ThirdFold][populate]", "*");

    const response = await fetch(strapiUrl.toString(), {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("About API Error:", response.status, errorText);
      throw new Error("Failed to fetch About data");
    }

    const json = await response.json();
    return json?.data?.ThirdFold || null;
  } catch (error) {
    console.error("AboutSection fetch error:", error);
    return null;
  }
}