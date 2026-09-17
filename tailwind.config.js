/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de Identidad Alquímica-33 (Sumi-e & Suibokuga)
        sumi: {
          950: '#050505', // Negro tinta puro
          900: '#0a0a0a', // Carbón profundo de mesada
          850: '#121212', // Pizarra japonesa
          800: '#171717', // Piedra de afilar / paneles
          700: '#262626', // Aguada de tinta oscura
          600: '#383838', // Sombra de pincel
          500: '#525252', // Gris niebla
          400: '#737373', // Pincel seco
        },
        washi: {
          50: '#ffffff',  // Blanco puro de contraste
          100: '#fafafa', // Blanco papel washi
          200: '#f5f5f5', // Pergamino suave
          300: '#e5e5e5', // Gris plata
          400: '#d4d4d4', // Tinta diluida
        },
        cinabrio: {
          400: '#f87171', // Bermellón brillante
          500: '#ef4444', // Rojo lacre japonés
          600: '#dc2626', // Cinabrio primario (Hanko seal)
          700: '#b91c1c', // Laca bermellón profunda
          800: '#991b1b', // Sangre de dragón oscura
          900: '#7f1d1d', // Sombra de cinabrio
        },
        lab: {
          bench: '#0a0a0a',
          glass: 'rgba(255, 255, 255, 0.5)',
          shadow: 'rgba(0, 0, 0, 0.7)',
          liquid: '#e0f2fe',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      }
    },
  },
  plugins: [],
}
