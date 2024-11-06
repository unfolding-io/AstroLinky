import type { APIRoute } from "astro";


import { image as qrImage } from "qr-image";
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  //const { slug } = url;
  const href = url.searchParams.get("href");
  const name = url.searchParams.get("name");

  const download = url.searchParams.get("download");

  if (!href) return new Response("missing_image", { status: 500 });

  try {
    const qr_svg = qrImage(decodeURIComponent(href), { type: "svg" });

    const headers: { [key: string]: string } = {
      "Content-Type": "image/svg+xml",
    };

    if (download) {
      headers["Content-Disposition"] = `attachment; filename="${name || "linky"}_qr.svg"`;
    }

    return new Response(qr_svg, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    return new Response("An error occurred", { status: 500 });
  }
};
