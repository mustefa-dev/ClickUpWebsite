/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
export default {
    darkMode: ["class"],
    content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            dropShadow: {
                "4xl": "0px 2px 3px rgba(230, 25, 25, 1)",
            },
            fontFamily: {
                yank: ["Yekan Bakh", "ui-sans-serif", "system-ui"],
                cairo: ["Cairo", "ui-sans-serif", "system-ui"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                "background-2": "hsl(var(--background-2))",
                customGreen: "hsl(var(--customGreen))",
                lightGreen: "hsl(var(--lightGreen))",
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
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "scall-out": {
                    "0%": { scale: 1 },
                    "10%": { scale: 0.9 },
                    "20%": { scale: 0.8 },
                    "30%": { scale: 0.7 },
                    "40%": { scale: 0.6 },
                    "50%": { scale: 0.5 },
                    "60%": { scale: 0.4 },
                    "70%": { scale: 0.3 },
                    "80%": { scale: 0.2 },
                    "90%": { scale: 0.1 },
                    "100%": { scale: 0 },
                },

                "scall-down": {
                    from: { scale: 1 },
                    to: { scall: 0 },
                },
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "scall-out": "scall-out 0.6 ease-out",
                "scall-down": "scall-down 0.6 ease-out",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};
