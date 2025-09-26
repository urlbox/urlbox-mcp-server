#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TextFormats, UrlboxOptionsParams } from "./index.t.js";
import type { UrlboxOkResponse, UrlboxOptions, UrlboxResponse } from "./index.t.js";

const URLBOX_BASE_URL = "https://api.urlbox.com";
const URLBOX_RENDER_SYNC = `${URLBOX_BASE_URL}/v1/render/sync`;
// Found at https://urlbox.com/dashboard/projects
const apiKey = process.env.API_KEY;
const secret = process.env.SECRET_KEY;

if (!apiKey) {
  console.error("Error: API_KEY environment variable is required");
  process.exit(1);
}

if (!secret) {
  console.error("Error: SECRET_KEY environment variable is required");
  process.exit(1);
}

const server = new McpServer({
  name: "urlbox",
  description:
    "Render website screenshots, videos, HTML, markdown and PDFs using the Urlbox.com API.",
  version: "1.0.0",
});

// const render = async <T>(url: string): Promise<T | string> => {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       return response.text();
//     }
//
//     return (await response.arrayBuffer()) as T;
//   } catch (error) {
//     return `Failed to render with error: ${error}`;
//   }
// };

const saveFileToDisk = (content: Buffer | string, filename: string) => {
  // Try multiple directories in order of preference
  const possibleDirs = [
    join(homedir(), "Downloads", "urlbox-renders"),
    join(homedir(), "Desktop", "urlbox-renders"),
    join(homedir(), "urlbox-renders"),
    "/tmp/urlbox-renders",
  ];

  for (const outputDir of possibleDirs) {
    try {
      mkdirSync(outputDir, { recursive: true });
      const filepath = join(outputDir, filename);
      writeFileSync(filepath, content);
      return filepath;
    } catch (error) {
      console.error(`Failed to save to ${outputDir}:`, error);
    }
  }

  console.error("Failed to save file to any directory");
  return;
};

const generateFilename = (options: UrlboxOptions, extension?: string) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const domain = options.url ? new URL(options.url).hostname : "html-render";
  const format = extension || options.format || "png";
  const ext = format === "jpeg" ? "jpg" : format;
  return `${domain}_${timestamp}.${ext}`;
};

const storeRenderFiles = async (response: UrlboxOkResponse, options: UrlboxOptions) => {
  const storedFiles: string[] = [];

  const urlsToStore = [
    { url: response.renderUrl, ext: options.format || "png" },
    { url: response.htmlUrl, ext: "html" },
    { url: response.markdownUrl, ext: "md" },
    { url: response.metadataUrl, ext: "json" },
    { url: response.mhtmlUrl, ext: "mhtml" },
  ];

  for (const { url, ext } of urlsToStore) {
    if (!url) continue;

    try {
      const fetchResponse = await fetch(url);
      if (!fetchResponse.ok) continue;

      // Handle text content vs binary content
      const isTextContent = TextFormats.includes(ext);

      const content = isTextContent
        ? await fetchResponse.text()
        : Buffer.from(await fetchResponse.arrayBuffer());

      const filename = generateFilename(options, ext);
      const savedPath = saveFileToDisk(content, filename);

      if (savedPath) {
        storedFiles.push(`${ext.toUpperCase()}: ${savedPath}`);
      }
    } catch (error) {
      console.error(`Failed to fetch/store ${ext} from ${url}:`, error);
    }
  }

  return storedFiles;
};

// const convertRenderLinkResultToMcp = (
//   response: ArrayBuffer | string,
//   buffer?: Buffer<ArrayBuffer>,
//   savedPath?: string
// ) => {
//   if (typeof response === "string") {
//     return {
//       content: [
//         {
//           type: "text" as const,
//           text: response,
//         },
//       ],
//     };
//   }
//
//   const buf = buffer || Buffer.from(response);
//
//   const metadata = {
//     fileSize: `${Math.round(buf.length / 1024)}KB`,
//     ...(savedPath ? { savedTo: savedPath } : {}),
//   };
//
//   const content = [
//     {
//       type: "text" as const,
//       text: `render captured:\n${Object.entries(metadata)
//         .map(([key, value]) => `• ${key}: ${value}`)
//         .join("\n")}`,
//     },
//   ];
//
//   // Claude has a 1MB limit. Just show a meta if it can't show the image
//   const THRESHOLD = 1048576 * 0.9;
//   return buf.length > THRESHOLD
//     ? { content }
//     : {
//         content: [
//           ...content,
//           {
//             type: "image" as const,
//             mimeType: "image/png",
//             data: buf.toString("base64"),
//           },
//         ],
//       };
// };

const convertSyncResultToMcp = (response: UrlboxResponse | string, storedFiles?: string[]) => {
  if (typeof response === "string") {
    return {
      content: [
        {
          type: "text" as const,
          text: response,
        },
      ],
    };
  }

  if ("error" in response) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Render failed: ${response.error.message} | Request ID: ${response.requestId}`,
        },
      ],
    };
  }

  let responseArray = Object.entries(response).map(([key, value]) => `${key}: ${value}`);

  if (storedFiles && storedFiles.length > 0) {
    responseArray = [...responseArray, ...storedFiles];
  }

  return {
    content: [
      {
        type: "text" as const,
        text: responseArray.join("\n"),
      },
    ],
  };
};

// const generateUrl = (options: UrlboxOptions) => {
//   const params = new URLSearchParams();
//
//   for (const [key, value] of Object.entries(options)) {
//     if (value !== undefined) {
//       params.append(key, String(value));
//     }
//   }
//
//   const queryString = params.toString();
//
//   // Generate HMAC-SHA256 token
//   const token = secret ? `/${createHmac("sha256", secret!).update(queryString).digest("hex")}` : "";
//
//   // Build final URL with apiKey
//   return `${URLBOX_BASE_URL}/v1/${apiKey}${token}/png${queryString ? `?${queryString}` : ""}`;
// };

const renderSync = async <T>(options: UrlboxOptions): Promise<T | string> => {
  try {
    const response = await fetch(URLBOX_RENDER_SYNC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(options),
    });

    return (await response.json()) as T;
  } catch (error) {
    return `Failed to render with error: ${error}`;
  }
};

// Doesn't always show up on users client, better to provide clickable link
// server.tool(
//   "screenshot",
//   "Captures a screenshot of a website using Urlbox.com API. For More information see https://urlbox.com/docs and https://urlbox.com/llms.txt.",
//   UrlboxOptionsParams,
//   async (options) => {
//     const url = generateUrl(options);
//     const response = await render<ArrayBuffer>(url);
//
//     let savedPath: string | undefined;
//     let buffer: Buffer<ArrayBuffer> | undefined;
//     if (options.store_renders && typeof response !== "string" && !("error" in response)) {
//       buffer = Buffer.from(response);
//       savedPath = saveFileToDisk(buffer, generateFilename(options));
//     }
//     return convertRenderLinkResultToMcp(response, buffer, savedPath);
//   }
// );

server.tool(
  "render",
  "Uses Urlbox.com's POST API for advanced rendering with side renders. Ideal for: use of many options, converting websites to HTML/PDF/markdown, extracting metadata, saving cookies, rendering custom HTML/CSS/JS, and generating multiple output formats simultaneously (html, pdf, md, cookies etc.), while also capturing the main screenshot's format.",
  UrlboxOptionsParams,
  async (options) => {
    const response = await renderSync<UrlboxResponse>(options);

    let storedFiles: string[] | undefined;
    if (options.store_renders && typeof response !== "string" && !("error" in response)) {
      storedFiles = await storeRenderFiles(response, options);
    }
    return convertSyncResultToMcp(response, storedFiles);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Urlbox MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
