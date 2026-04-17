import { NextResponse } from "next/server";

const BASE_URL = "https://admin.iaamonline.org/api";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req: Request) {
    try {
        const { videoId } = await req.json();

        if (!videoId) {
            return NextResponse.json({ success: false });
        }

        // 1️⃣ Find video
        const findRes = await fetch(
            `${BASE_URL}/vedios?filters[VideoID][$eq]=${videoId}`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_TOKEN}`,
                },
                cache: "no-store",
            }
        );

        const findJson = await findRes.json();

        if (!findJson.data.length) {
            return NextResponse.json({ success: false });
        }

        const video = findJson.data[0];
        const currentViews = typeof video.Views === "number" ? video.Views : 0;

        const documentId = video.documentId;

        const updateRes = await fetch(
            `${BASE_URL}/vedios/${documentId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${STRAPI_TOKEN}`,
                },
                body: JSON.stringify({
                    data: {
                        Views: currentViews + 1,
                    },
                }),
            }
        );

        if (!updateRes.ok) {
            const err = await updateRes.text();
            console.log("Update failed:", err);
            return NextResponse.json({ success: false });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.log("Server error:", error);
        return NextResponse.json({ success: false });
    }
}