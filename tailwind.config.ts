import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "roam": {
          "0%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "15%": { transform: "translateX(-4px) translateY(-3px) rotate(-2deg)" },
          "30%": { transform: "translateX(2px) translateY(-6px) rotate(1deg)" },
          "50%": { transform: "translateX(-2px) translateY(-8px) rotate(-1deg)" },
          "70%": { transform: "translateX(4px) translateY(-4px) rotate(2deg)" },
          "85%": { transform: "translateX(1px) translateY(-2px) rotate(-1deg)" },
          "100%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
        },
        "waddle": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-4px) rotate(-8deg)" },
          "75%": { transform: "translateY(-4px) rotate(8deg)" },
        },
        "guard": {
          "0%, 100%": { transform: "translateY(0) scale(1.1)" },
          "30%": { transform: "translateY(-5px) scale(1.12)" },
          "60%": { transform: "translateY(-2px) scale(1.08) rotate(3deg)" },
          "80%": { transform: "translateY(-4px) scale(1.1) rotate(-2deg)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(-3deg) scale(1.05)" },
          "30%": { transform: "rotate(3deg) scale(1.05)" },
          "45%": { transform: "rotate(-2deg)" },
          "60%": { transform: "rotate(2deg)" },
          "75%": { transform: "rotate(-1deg)" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1) translateY(0)" },
          "50%": { transform: "scale(1.03) translateY(-2px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "roam": "roam 6s ease-in-out infinite",
        "waddle": "waddle 0.4s ease-in-out infinite",
        "guard": "guard 3s ease-in-out infinite",
        "wiggle": "wiggle 1.5s ease-in-out infinite",
        "breathe": "breathe 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
