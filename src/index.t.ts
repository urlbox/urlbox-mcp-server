import { z } from "zod";

export const TextFormats = ["html", "mhtml", "json", "md", "svg"];

export const UrlboxOptionsParams = {
  store_renders: z
    .boolean()
    .optional()
    .describe("Flip this to true to save all downloadable render links"),
  // Basic Options
  url: z.string().url().describe("The URL or domain of the website you want to screenshot."),
  html: z.string().optional().describe("The HTML you want to render if not a URL."),
  format: z
    .enum(["png", "jpeg", "webp", "avif", "svg", "pdf", "mp4", "webm", ...TextFormats])
    .optional()
    .describe("The output format of the resulting render."),
  width: z
    .number()
    .min(100)
    .max(4000)
    .optional()
    .describe("The viewport width of the browser, in pixels."),
  height: z
    .number()
    .min(100)
    .max(4000)
    .optional()
    .describe("The viewport height of the browser, in pixels."),
  full_page: z
    .boolean()
    .optional()
    .describe("Specify whether to capture the full scrollable area of the website."),
  selector: z
    .string()
    .optional()
    .describe("Take a screenshot of the element that matches this selector."),
  clip: z
    .string()
    .optional()
    .describe("Clip the screenshot to the bounding box specified by x,y,width,height."),
  gpu: z
    .boolean()
    .optional()
    .describe("Enable GPU acceleration to render 3D scenes and heavy WebGL content."),
  // Blocking Options
  block_ads: z
    .boolean()
    .optional()
    .describe("Blocks requests from popular advertising networks from loading."),
  hide_cookie_banners: z
    .boolean()
    .optional()
    .describe("Automatically hides cookie banners from most websites."),
  click_accept: z
    .boolean()
    .optional()
    .describe("Attempts to click on the 'Accept' button to accept cookies."),
  press_escape: z
    .boolean()
    .optional()
    .describe("Attempts to press the Escape (ESC) key before capturing the page."),
  block_urls: z
    .array(z.string())
    .optional()
    .describe(
      "Block requests from specific domains from loading. You can use wildcard characters to match subdomains."
    ),
  block_images: z.boolean().optional().describe("Blocks image requests"),
  block_fonts: z.boolean().optional().describe("Blocks font requests"),
  block_medias: z.boolean().optional().describe("Block video and audio requests"),
  block_styles: z.boolean().optional().describe("Prevent stylesheet requests from loading"),
  block_scripts: z
    .boolean()
    .optional()
    .describe("Prevent requests for javascript scripts from loading"),
  block_frames: z.boolean().optional().describe("Block frames."),
  block_fetch: z.boolean().optional().describe("Block fetch requests from the target URL."),
  block_xhr: z.boolean().optional().describe("Block XHR requests from the target URL."),
  block_sockets: z.boolean().optional().describe("Block websocket requests."),
  hide_selector: z
    .string()
    .optional()
    .describe("Comma-delimited string of CSS element selectors that are hidden."),
  // Customize Options
  js: z.string().optional().describe("Execute custom JavaScript in the context of the page."),
  css: z.string().optional().describe("Inject custom CSS into the page"),
  dark_mode: z
    .boolean()
    .optional()
    .describe("Emulate dark mode on websites by setting prefers-color-scheme: dark"),
  reduced_motion: z
    .boolean()
    .optional()
    .describe("Prefer less animations on websites by setting prefers-reduced-motion: reduced"),
  show_timestamp: z
    .boolean()
    .optional()
    .describe("Shows a timestamp in a header above the rendered screenshot."),
  show_url: z
    .boolean()
    .optional()
    .describe("Shows a URL in a header above the rendered screenshot."),

  // Screenshot Options
  retina: z
    .boolean()
    .optional()
    .describe(
      "Take a 'retina' or high-definition screenshot, equivalent to setting a device pixel ratio of 2.0."
    ),
  img_fit: z
    .enum(["cover", "contain", "fill", "inside", "outside"])
    .optional()
    .describe("How the screenshot should be resized or cropped to fit the dimensions."),
  img_position: z
    .enum([
      "north",
      "northeast",
      "east",
      "southeast",
      "south",
      "southwest",
      "west",
      "northwest",
      "center",
    ])
    .optional()
    .describe("How the image should be positioned when using an img_fit of cover or contain."),
  img_bg: z
    .string()
    .optional()
    .describe("Background colour to use when img_fit is contain, or img_pad is used."),
  img_pad: z.string().optional().describe("Pad the screenshot, giving it a border."),
  quality: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .describe("The image quality of the resulting screenshot (JPEG/WebP only)"),
  transparent: z
    .boolean()
    .optional()
    .describe(
      "If a website has no background color set, the image will have a transparent background."
    ),
  max_height: z
    .number()
    .min(100)
    .max(20000)
    .optional()
    .describe("Limit the screenshot to a maximum height."),

  // PDF Options
  pdf_page_size: z
    .enum(["A0", "A1", "A2", "A3", "A4", "A5", "A6", "Legal", "Letter", "Ledger", "Tabloid"])
    .optional()
    .describe("Sets the PDF page size."),
  pdf_page_range: z.string().optional().describe("Sets the PDF page range to return."),
  pdf_page_width: z
    .number()
    .min(100)
    .max(4000)
    .optional()
    .describe("Sets the PDF page width, in pixels."),
  pdf_page_height: z
    .number()
    .min(100)
    .max(4000)
    .optional()
    .describe("Sets the PDF page height, in pixels."),
  pdf_margin: z.string().optional().describe("Sets the margin of the PDF document."),
  pdf_margin_top: z.string().optional().describe("Sets a custom top margin on the PDF."),
  pdf_margin_right: z.string().optional().describe("Sets a custom right margin on the PDF."),
  pdf_margin_bottom: z.string().optional().describe("Sets a custom bottom margin on the PDF."),
  pdf_margin_left: z.string().optional().describe("Set a custom left margin on the PDF."),
  pdf_auto_crop: z.boolean().optional().describe("Automatically remove white space from PDF."),
  pdf_scale: z
    .number()
    .min(0.1)
    .max(2.0)
    .optional()
    .describe("Sets the scale factor of the website content in the PDF."),
  pdf_orientation: z
    .enum(["portrait", "landscape"])
    .optional()
    .describe("Sets the orientation of the PDF."),
  pdf_background: z
    .boolean()
    .optional()
    .describe("Sets whether to print background images in the PDF"),
  disable_ligatures: z.boolean().optional().describe("Prevents ligatures from being used."),
  media: z
    .enum(["screen", "print"])
    .optional()
    .describe("By default, when generating a PDF, the print CSS media query is used."),
  pdf_show_header: z
    .boolean()
    .optional()
    .describe("Whether to show the default pdf header on each page of the pdf."),
  pdf_header: z
    .string()
    .optional()
    .describe("Change the default pdf header that is shown on each page of the pdf."),
  pdf_show_footer: z
    .boolean()
    .optional()
    .describe("Whether to show the default pdf footer on each page of the pdf."),
  pdf_footer: z
    .string()
    .optional()
    .describe("Change the default pdf footer that is shown on each page of the pdf."),
  readable: z
    .boolean()
    .optional()
    .describe("Make the pdf into a readable document by removing unnecessary elements."),

  // Cache Options
  force: z
    .boolean()
    .optional()
    .describe("Generate a fresh render, instead of getting a cached version."),
  unique: z.string().optional().describe("Pass a unique string such as a UUID, hash or timestamp."),
  ttl: z
    .number()
    .min(60)
    .max(2592000)
    .optional()
    .describe("The duration to keep a render in the cache, in seconds."),

  // Request Options
  proxy: z
    .string()
    .optional()
    .describe("Pass in a proxy server address to make screenshot requests via that server."),
  header: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe("Set a header on the request when loading the URL"),
  cookie: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe("Sets a cookie on the request when loading the URL."),
  user_agent: z
    .union([z.enum(["random", "mobile", "desktop"]), z.string()])
    .optional()
    .describe("Sets the User-Agent string for the request"),
  platform: z
    .string()
    .optional()
    .describe("Sets the navigator.platform that the browser will report for the request."),
  accept_lang: z
    .string()
    .optional()
    .describe("Sets an Accept-Language header on requests to the target URL"),
  authorization: z
    .string()
    .optional()
    .describe("Sets an Authorization header on requests to the target URL."),
  tz: z.string().optional().describe("Emulate the timezone to use when rendering pages."),
  engine_version: z
    .enum(["latest", "stable"])
    .optional()
    .describe(
      "Sets the version of the urlbox rendering engine to use. Latest provides the latest bug fixes and features."
    ),
  certify: z
    .boolean()
    .optional()
    .describe("Creates a hash of the rendered file, timestamp and options providing proof."),

  // Wait Options
  delay: z
    .number()
    .min(0)
    .max(30000)
    .optional()
    .describe("The amount of time to wait before Urlbox captures a render in milliseconds."),
  timeout: z
    .number()
    .min(5000)
    .max(100000)
    .optional()
    .describe("The amount of time to wait for the requested URL to load, in milliseconds."),
  wait_until: z
    .enum(["domloaded", "mostrequestsfinished", "requestsfinished", "loaded"])
    .optional()
    .describe("Waits until the specified DOM event has fired before capturing a render."),
  wait_for: z
    .string()
    .optional()
    .describe("Waits for the element specified by this selector to be present in the DOM."),
  wait_to_leave: z
    .string()
    .optional()
    .describe("Waits for the element specified by this selector to be absent from the DOM."),
  wait_timeout: z
    .number()
    .min(1000)
    .max(30000)
    .optional()
    .describe("The amount of time to wait for the wait_for element to appear."),

  // Fail Options
  fail_if_selector_missing: z
    .boolean()
    .optional()
    .describe(
      "Fails the request if the elements specified by selector or wait_for options are not found."
    ),
  fail_if_selector_present: z
    .boolean()
    .optional()
    .describe("Fails the request if the element specified by wait_to_leave option is found."),
  fail_on_4xx: z
    .boolean()
    .optional()
    .describe(
      "If true and the requested URL returns a status code between 400 and 499, Urlbox will fail."
    ),
  fail_on_5xx: z
    .boolean()
    .optional()
    .describe(
      "If true and the requested URL returns a status code between 500 and 599, Urlbox will fail."
    ),

  // Page Options
  scroll_to: z
    .union([z.string(), z.number()])
    .optional()
    .describe("Scroll, to either an element or to a pixel offset from the top."),
  click: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe("Specifies an element selector to click before generating a screenshot or PDF"),
  click_all: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe("Specifies an element selector to click all matching elements."),
  hover: z
    .string()
    .optional()
    .describe("Specifies an element selector to hover over before generating a screenshot or PDF"),
  bg_color: z
    .string()
    .optional()
    .describe("Specify a hex code or CSS color string to use as the background color"),

  // Full Page Options
  full_page_mode: z
    .enum(["scroll", "native"])
    .optional()
    .describe("Whether to use scroll and stitch algorithm or native full page screenshot."),
  full_width: z
    .boolean()
    .optional()
    .describe("When full_page=true, specify whether to capture the full width of the website."),
  allow_infinite: z
    .boolean()
    .optional()
    .describe("Override the default behavior to prevent infinite scrolling."),
  skip_scroll: z
    .boolean()
    .optional()
    .describe("Speed up renders by skipping an initial scroll through the page."),
  detect_full_height: z
    .boolean()
    .optional()
    .describe("Prevent backgrounds from getting stretched when making a full page screenshot."),
  max_section_height: z
    .number()
    .min(1000)
    .max(10000)
    .optional()
    .describe("The maximum height of each image section when taking a full_page screenshot."),
  scroll_increment: z
    .number()
    .min(100)
    .max(2000)
    .optional()
    .describe("Sets how many pixels to scroll when scrolling the page."),
  scroll_delay: z
    .number()
    .min(100)
    .max(5000)
    .optional()
    .describe("The time to wait between taking the screenshots of each individual section."),

  // Highlighting Options
  highlight: z
    .string()
    .optional()
    .describe("Specify a string to highlight on the page before capturing a screenshot or PDF."),
  highlightfg: z.string().optional().describe("Specify the text color of the highlighted word."),
  highlightbg: z
    .string()
    .optional()
    .describe("Specify the background color of the highlighted word."),

  // Geolocation Options
  latitude: z
    .number()
    .min(-90)
    .max(90)
    .optional()
    .describe("Sets the latitude used to emulate the Geolocation API."),
  longitude: z
    .number()
    .min(-180)
    .max(180)
    .optional()
    .describe("Sets the longitude used to emulate the Geolocation API."),
  accuracy: z
    .number()
    .min(0)
    .optional()
    .describe("Sets the accuracy of the Geolocation API in metres."),

  // Storage Options
  use_s3: z
    .boolean()
    .optional()
    .describe(
      "Save the render directly to the S3 (or S3-Compatible) bucket configured on your account."
    ),
  s3_path: z
    .string()
    .optional()
    .describe("Sets the S3 path, including subdirectories and the filename."),
  no_suffix: z
    .boolean()
    .optional()
    .describe("By default, urlbox adds the file extension to the s3_path."),
  s3_bucket: z
    .string()
    .optional()
    .describe("Overrides the configured bucket to use when saving the render."),
  s3_endpoint: z
    .string()
    .optional()
    .describe("Change the endpoint URL to use an S3 compatible storage provider."),
  s3_region: z
    .string()
    .optional()
    .describe("Override the configured S3 region when saving the render."),
  cdn_host: z
    .string()
    .optional()
    .describe("If your custom bucket is fronted by a CDN, you can set the host name here."),
  s3_storageclass: z.string().optional().describe("Sets the s3 storage class."),
  save_html: z
    .boolean()
    .optional()
    .describe(
      "Alongside rendering the main options.format shot, also saves the render as HTML returning a storage URL."
    ),
  save_metadata: z
    .boolean()
    .optional()
    .describe(
      "Alongside rendering the main options.format shot, also saves render's Metadata returning a storage URL."
    ),
  save_markdown: z
    .boolean()
    .optional()
    .describe(
      "Alongside rendering the main options.format shot, also saves render as Markdown returning a storage URL."
    ),
  save_mhtml: z
    .boolean()
    .optional()
    .describe(
      "Alongside rendering the main options.format shot, also saves render as MHTML returning a storage URL."
    ),
  save_cookies: z
    .boolean()
    .optional()
    .describe(
      "Alongside rendering the main options.format shot, also saves renders used cookies returning a storage URL."
    ),
  pov: z
    .string()
    .optional()
    .describe(`Use a Point of View (PoV) to more convincingly and accurately emulate loading a website from a particular location, with better success than many other options here. This lets you view a website as if you were browsing from a less block-prone perspective, such as through a trusted, location-specific, or residential IP.
          - hidden - The basic level of anonymisation to mask your location (great starting place)
          - trusted - Using more trusted, reliable networks to get a higher success rate when emulating a country
          - stealth - Advanced protocols designed to bypass bot detection
          - premium - Emulates high-quality residential networks for maximum reliability over hidden and trusted
          - geo - Location-specific access from real devices in your target country
          
          This option is not compatible when trying to use authorization or cookies.
        `),
  pov_country: z
    .string()
    .optional()
    .describe(
      "You can also specify a particular country for your PoV by adding a country code such as: us, gb, ca - If we don't have one available, do contact support@urlbox.com and we'll see what we can do."
    ),
};

export const UrlboxOptionsSchema = z.object(UrlboxOptionsParams);

export type UrlboxOptions = z.infer<typeof UrlboxOptionsSchema>;

export type ThumbnailResult = {
  key?: string;
  location?: string;
  width?: number;
  height?: number;
};

export type UrlboxOkResponse = {
  renderUrl: string;
  size: string;
  renderTime?: number;
  queueTime?: number;
  bandwidth?: number;
  htmlUrl?: string;
  markdownUrl?: string;
  metadataUrl?: string;
  mhtmlUrl?: string;
  thumbnails?: ThumbnailResult[] | Record<string, Omit<ThumbnailResult, "key">>;
  metadata?: any;
  custom_id?: string;
  llm?: any;
  timestamp?: string;
  certifiedHash?: string;
  hashedOptions?: string;
};

export type UrlboxErrorResponse = {
  error: {
    message: string;
    code: string;
  };
  errors?: any;
  requestId?: string;
};

export type UrlboxResponse = UrlboxOkResponse | UrlboxErrorResponse;
