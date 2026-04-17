"use client";

import { useEffect, useState } from "react";

export default function ViewCount({ videoId, initialViews }: {
  videoId: string;
  initialViews: number;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    async function incrementAndFetch() {
      // increment
      await fetch("/api/increment-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });

      // fetch updated value
      const res = await fetch(`/api/get-views?videoId=${videoId}`);
      const data = await res.json();

      if (typeof data.views === "number") {
        setViews(data.views);
      }
    }

    incrementAndFetch();
  }, [videoId]);

  return <>{views} Views</>;
}