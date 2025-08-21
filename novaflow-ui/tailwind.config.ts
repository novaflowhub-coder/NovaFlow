import type { Config } from "tailwindcss"
import defaultConfig from "shadcn/ui/tailwind.config"

const config: Config = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
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
        // Additional colorful theme colors
        violet: {
          50: "hsl(270 100% 98%)",
          100: "hsl(269 100% 95%)",
          200: "hsl(269 100% 92%)",
          300: "hsl(269 87% 85%)",
          400: "hsl(270 95% 75%)",
          500: "hsl(271 91% 65%)",
          600: "hsl(271 81% 56%)",
          700: "hsl(272 72% 47%)",
          800: "hsl(272 67% 39%)",
          900: "hsl(273 67% 32%)",
          950: "hsl(274 87% 21%)",
        },
        fuchsia: {
          50: "hsl(289 100% 98%)",
          100: "hsl(287 100% 95%)",
          200: "hsl(288 96% 91%)",
          300: "hsl(291 93% 83%)",
          400: "hsl(292 91% 73%)",
          500: "hsl(292 84% 61%)",
          600: "hsl(293 69% 49%)",
          700: "hsl(295 72% 40%)",
          800: "hsl(295 70% 33%)",
          900: "hsl(297 64% 28%)",
          950: "hsl(297 90% 16%)",
        },
        cyan: {
          50: "hsl(183 100% 96%)",
          100: "hsl(185 96% 90%)",
          200: "hsl(186 94% 82%)",
          300: "hsl(187 92% 69%)",
          400: "hsl(188 86% 53%)",
          500: "hsl(189 94% 43%)",
          600: "hsl(192 91% 36%)",
          700: "hsl(193 82% 31%)",
          800: "hsl(194 70% 27%)",
          900: "hsl(196 64% 24%)",
          950: "hsl(197 79% 15%)",
        },
        emerald: {
          50: "hsl(151 81% 96%)",
          100: "hsl(149 80% 90%)",
          200: "hsl(152 76% 80%)",
          300: "hsl(156 72% 67%)",
          400: "hsl(158 64% 52%)",
          500: "hsl(160 84% 39%)",
          600: "hsl(161 94% 30%)",
          700: "hsl(163 94% 24%)",
          800: "hsl(163 88% 20%)",
          900: "hsl(164 86% 16%)",
          950: "hsl(166 91% 9%)",
        },
        amber: {
          50: "hsl(48 100% 96%)",
          100: "hsl(48 96% 89%)",
          200: "hsl(48 97% 77%)",
          300: "hsl(46 97% 65%)",
          400: "hsl(43 96% 56%)",
          500: "hsl(38 92% 50%)",
          600: "hsl(32 95% 44%)",
          700: "hsl(26 90% 37%)",
          800: "hsl(23 83% 31%)",
          900: "hsl(22 78% 26%)",
          950: "hsl(21 92% 14%)",
        },
      },
      keyframes: {
        ...defaultConfig.theme.extend.keyframes,
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "gradient-shift": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        "color-cycle": {
          "0%": { color: "hsl(280 100% 60%)" },
          "25%": { color: "hsl(320 100% 65%)" },
          "50%": { color: "hsl(200 100% 70%)" },
          "75%": { color: "hsl(160 100% 50%)" },
          "100%": { color: "hsl(280 100% 60%)" },
        },
      },
      animation: {
        ...defaultConfig.theme.extend.animation,
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",
        "color-cycle": "color-cycle 4s ease-in-out infinite",
      },
      backgroundImage: {
        ...defaultConfig.theme.extend.backgroundImage,
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "rainbow-gradient":
          "linear-gradient(45deg, hsl(280 100% 60%), hsl(320 100% 65%), hsl(200 100% 70%), hsl(160 100% 50%), hsl(40 100% 60%))",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}

export default config
