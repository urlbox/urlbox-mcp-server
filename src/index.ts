#!/usr/bin/env node
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {UrlboxOptions, UrlboxOptionsParams} from "./index.t.js";
import {createHmac} from "crypto";
import {writeFileSync, mkdirSync} from "fs";
import {join} from "path";
import {homedir} from "os";

const URLBOX_BASE_URL = "https://api.urlbox.com";
// Found at https://urlbox.com/dashboard/projects
const apiKey = process.env.API_KEY;
const secret = process.env.SECRET_KEY;

if (!apiKey) {
    console.error("Error: URLBOX_SECRET environment variable is required");
    process.exit(1);
}

const server = new McpServer({
    name: "urlbox",
    description: "Render website screenshots, videos, HTML, markdown and PDFs using the Urlbox.com API.",
    version: "1.0.0",
});

const render = async <T>(
    url: string
): Promise<T | { error: string }> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return {
                error: `Failed to fetch render with status: ${response.status}`,
            };
        }

        return (await response.arrayBuffer()) as T;
    } catch (error) {
        return {
            error: `Failed to render with error: ${error}`,
        };
    }
}

const saveImageToDisk = (buffer: Buffer, options: UrlboxOptions) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const domain = options.url ? new URL(options.url).hostname : 'html-render';
    const format = options.format || 'png';
    const extension = format === 'jpeg' ? 'jpg' : format;

    const filename = `${domain}_${timestamp}.${extension}`;

    // Try multiple directories in order of preference
    const possibleDirs = [
        join(homedir(), 'Downloads', 'urlbox-renders'),
        join(homedir(), 'Desktop', 'urlbox-renders'),
        join(homedir(), 'urlbox-renders'),
        '/tmp/urlbox-renders'
    ];

    for (const outputDir of possibleDirs) {
        try {
            mkdirSync(outputDir, { recursive: true });
            const filepath = join(outputDir, filename);
            writeFileSync(filepath, buffer);
            return filepath;
        } catch (error) {
            console.error(`Failed to save to ${outputDir}:`, error);
        }
    }

    console.error('Failed to save image to any directory');
    return;
}

const convertResultToMcp = (result: ArrayBuffer | { error: string }, options: UrlboxOptions, url: string) => {
    if ("error" in result) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Failed to retrieve render for ${url}: ${result.error}`,
                },
            ],
        };
    }

    const buffer = Buffer.from(result);
    const savedPath = saveImageToDisk(buffer, options);
    const metadata = {
        fileSize: `${Math.round(buffer.length / 1024)}KB`,
        ...(options.url ? {url: options.url} : {}),
        ...(savedPath ? {savedTo: savedPath} : {}),
        // TODO other options?
    };

    const content = [
        {
            type: "text" as const,
            text: `render captured:\n${Object.entries(metadata)
                .map(([key, value]) => `• ${key}: ${value}`)
                .join("\n")}`,
        },
    ];

    // Claude has a 1MB limit. Just show a meta if it can't show the image
    const THRESHOLD = 1048576 * 0.9;
    return buffer.length > THRESHOLD
        ? { content }
        : {
              content: [
                  ...content,
                  {
                      type: "image" as const,
                      mimeType: "image/png",
                      data: buffer.toString("base64"),
                  },
              ],
          };
}

const generateUrl = (options: UrlboxOptions) => {
    // Remove undefined values and build query string
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
            params.append(key, String(value));
        }
    });

    const queryString = params.toString();

    // Generate HMAC-SHA256 token
    const token = secret ? `/${createHmac('sha256', secret!).update(queryString).digest('hex')}` : "";

    // Build final URL with apiKey
    return `${URLBOX_BASE_URL}/v1/${apiKey}${token}/png${queryString ? `?${queryString}` : ''}`;
}

// Define the screenshot tool with comprehensive validation
server.tool(
    "render",
    "Captures a screenshot of a website using Urlbox.com API. For More information see https://urlbox.com/docs and https://urlbox.com/llms.txt.",
    UrlboxOptionsParams,
    async (options) => {
        const url = generateUrl(options);

        const result = await render<ArrayBuffer>(url);

        return convertResultToMcp(result, options, url);
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
