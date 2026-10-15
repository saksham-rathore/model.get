import React from "react";

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap";

export const GOOGLE_FONTS_PRECONNECT = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
] as const;

export const fontFamilies = {
  display: ['"Bricolage Grotesque"', "Geist", "system-ui", "sans-serif"].join(", "),
  sans: ["Geist", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(", "),
  mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"].join(", "),
} as const;

export const fontClasses = {
  display: "font-display",
  sans: "font-sans",
  mono: "font-mono",
} as const;

export interface FontDefinition {
  name: string;
  variable: string;
  className: string;
  family: string;
  weights: (string | number)[];
}

export const displayFont: FontDefinition = {
  name: "Bricolage Grotesque",
  variable: "--font-display",
  className: "font-display",
  family: fontFamilies.display,
  weights: ["500", "600", "700", "800"],
};

export const sansFont: FontDefinition = {
  name: "Geist",
  variable: "--font-sans",
  className: "font-sans",
  family: fontFamilies.sans,
  weights: ["400", "500", "600"],
};

export const monoFont: FontDefinition = {
  name: "Geist Mono",
  variable: "--font-mono",
  className: "font-mono",
  family: fontFamilies.mono,
  weights: ["400", "500"],
};

export const fonts = {
  display: displayFont,
  sans: sansFont,
  mono: monoFont,
} as const;

/**
 * Dynamically injects the Google Fonts <link> tags into the document head.
 * Useful for runtime client-side font loading.
 */
export function loadFonts(): void {
  if (typeof document === "undefined") return;

  if (document.querySelector(`link[href="${GOOGLE_FONTS_URL}"]`)) {
    return;
  }

  GOOGLE_FONTS_PRECONNECT.forEach((url, i) => {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = url;
      if (i === 1) {
        link.crossOrigin = "anonymous";
      }
      document.head.appendChild(link);
    }
  });

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = GOOGLE_FONTS_URL;
  document.head.appendChild(fontLink);
}

/**
 * React Component that outputs preconnect and stylesheet link elements for fonts.
 */
export function FontLinks(): React.JSX.Element {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
    React.createElement("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }),
    React.createElement("link", { rel: "stylesheet", href: GOOGLE_FONTS_URL })
  );
}

export default fonts;
