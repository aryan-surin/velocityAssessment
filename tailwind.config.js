/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Custom node colors matching Material Design palette
        nodeInput: '#e3f2fd',
        nodeOutput: '#e8f5e9',
        nodeLlm: '#fff3e0',
        nodeText: '#f3e5f5',
        nodeTransform: '#e0f2f1',
        nodeConditional: '#fff9c4',
        nodeFilter: '#fce4ec',
        nodeAggregator: '#f1f8e9',
        nodeValidator: '#ede7f6'
      }
    },
  },
  plugins: [],
}
