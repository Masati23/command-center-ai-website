import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.commandcenterai.net/sitemap.xml",
    host: "https://www.commandcenterai.net",
  };
}
