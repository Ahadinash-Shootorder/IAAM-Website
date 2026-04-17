"use client";

import { useEffect, useState } from "react";

interface SecureCloudflareVideoProps {
  videoId: string;
}

export default function SecureCloudflareVideo({
  videoId,
}: SecureCloudflareVideoProps) {
  const [token, setToken] = useState<string | null>(null);
  const [counted, setCounted] = useState(false);

  const subdomain =
    process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN;

  /* Fetch Token */
  useEffect(() => {
    async function fetchToken() {
      const res = await fetch("/api/stream-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      const data = await res.json();
      setToken(data.token);
    }

    fetchToken();
  }, [videoId]);

  /* Count view only on user click */
  function handleUserInteraction() {
    if (counted) return;

    if (sessionStorage.getItem(`viewed-${videoId}`)) return;

    sessionStorage.setItem(`viewed-${videoId}`, "true");
    setCounted(true);

    fetch("/api/increment-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId }),
    });
  }

  if (!token) {
    return (
      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="w-full aspect-video rounded-lg overflow-hidden relative"
      onClick={handleUserInteraction}   // 🔥 Only count on click
    >
      <iframe
        src={`https://${subdomain}.cloudflarestream.com/${videoId}/iframe?token=${token}`}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        className="w-full h-full border-0 absolute inset-0"
      />
    </div>
  );
}