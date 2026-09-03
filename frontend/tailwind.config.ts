import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        chalk: "#f5f4ef",
        "chalk-surface": "#edece4",
        ink: "#0a0a0c",
        acid: "#e2f952",
        "acid-hover": "#d0ec36",
        "safety-teal": "#0d5c56",
        "safety-teal-light": "#e4f5f3",
        redact: "#111113",
        "hazard-red": "#dc2626",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--content-bg)",
        foreground: "hsl(var(--foreground))",
        brand: {
          navy: "var(--brand-navy)",
          indigo: "var(--brand-indigo)",
          "indigo-light": "var(--brand-indigo-light)",
          slate: "var(--brand-slate)",
        },
        sidebar: {
          bg: "var(--sidebar-bg)",
          text: "var(--sidebar-text)",
          active: "var(--sidebar-active)",
        },
        severity: {
          critical: "var(--critical)",
          high: "var(--high)",
          medium: "var(--medium)",
          low: "var(--low)",
        },
        verdict: {
          safe: "var(--safe)",
          borderline: "var(--borderline)",
          unsafe: "var(--unsafe)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderWidth: {
        '1.5': '1.5px',
        '3': '3px'
      },
      boxShadow: {
        'brutal': '4px 4px 0px #0a0a0c',
        'brutal-lg': '8px 8px 0px #0a0a0c',
        'brutal-acid': '4px 4px 0px #e2f952',
        'brutal-teal': '4px 4px 0px #0d5c56',
        'brutal-active': '1px 1px 0px #0a0a0c'
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["Space Mono", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
