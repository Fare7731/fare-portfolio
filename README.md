# FareOS - Video Editor Portfolio 🎬

**TL;DR:** A highly customized, interactive portfolio for a video editor and motion designer (Fare). Designed to look and feel like a modern Linux tiling window manager (WM), built entirely with React, TypeScript, and Tailwind CSS. 

---

## ✨ Feature Overview

- 🪟 **Window Manager UI:** Draggable, animated window containers that mimic a desktop environment.
- 🚀 **Virtual Workspaces:** Seamlessly switch between 3 virtual workspaces to organize your browsing experience.
- 📊 **Interactive Top Panel:** Fully functional system tray featuring:
  - Live clock and interactive calendar widget.
  - Simulated system monitoring (live CPU & RAM usage animations).
  - Simulated Wi-Fi networks and Battery status widgets.
- 🎥 **Video Showcases:** Beautifully integrated YouTube embeds with scroll/swipe navigation for:
  - Full-length horizontal videos.
  - Short-form vertical content (TikTok/Reels/Shorts format).
  - Motion graphics and animations.
- ⌨️ **Terminal Easter Egg:** A hidden, functional-looking terminal running a mock `fastfetch` on Arch Linux.
- 📱 **Mobile Fallback:** A dedicated, polished mobile view informing users to visit on a desktop for the full OS experience.

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool:** Vite (Inferred via standard modern React deployments)
- **Deployment:** GitHub Pages (Automated via GitHub Actions)

---

## 🚀 Local Deployment

To run this project locally on your machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fare7731/FareOS.git
   cd fare-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   *The application will typically be available at `http://localhost:3000`.*

4. **Build for production:**
   ```bash
   npm run build
   ```
   *This will compile the TypeScript and output the optimized static files into the `dist/` directory, ready to be hosted.*

---

## 📄 License

This project is open-source and available under the [CC-BY-4.0 License](LICENSE). 

*Note: The personal branding, video content, images, and text copy belong to Fare (Eugene) and are fully copyrighted. Feel free to fork the code, but please replace the personal data and videos with your own.*
