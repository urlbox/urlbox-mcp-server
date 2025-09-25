import { z } from "zod";

export const UrlboxOptionsParams = {
  // Basic Options
  url: z.string().url().describe("The URL or domain of the website you want to screenshot."),
  html: z.string().optional().describe("The HTML you want to render if not a URL."),
  format: z.enum(["png", "jpeg", "webp", "avif", "svg", "pdf", "html", "mp4", "webm", "md"]).optional().describe("The output format of the resulting render."),
  full_page: z.boolean().optional().describe("Specify whether to capture the full scrollable area of the website."),
};

export const UrlboxOptionsSchema = z.object(UrlboxOptionsParams)

export type UrlboxOptions = z.infer<typeof UrlboxOptionsSchema>;
