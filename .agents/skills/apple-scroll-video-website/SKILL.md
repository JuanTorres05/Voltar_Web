---
name: apple-scroll-video-website
description: Architectural blueprint and step-by-step guidelines for building 60 FPS Apple-style continuous video/canvas scroll animation luxury websites (Awwwards standard). Covers ffmpeg frame sequence extraction, Lenis + GSAP ScrollTrigger canvas scrubbing, transparent glassmorphism text cards, liquid blur word reveals, and luxury preloaders.
---

# Apple-Style Continuous Video Scroll Website Skill

This skill provides a production-grade blueprint for building ultra-smooth, 60 FPS Apple-style video scrubbing websites with luxury typography and interactive scroll triggers.

---

## 🏗️ Core Architecture & Workflow

```
┌────────────────────────────────────────────────────────┐
│  Luxury Preloader Curtain (0% -> 100% Preloading)       │
└───────────────────┬────────────────────────────────────┘
                    │ Curtain Exit Reveal (y: "-100%")
                    ▼
┌────────────────────────────────────────────────────────┐
│  Fixed 60 FPS Canvas Frame Scroll Engine (z-index: 0)   │
│  - Preloaded Image Sequence (frame_001.jpg -> 240)      │
│  - Object-fit cover 2D Canvas rendering                │
│  - GSAP ScrollTrigger bound to document.body            │
└───────────────────┬────────────────────────────────────┘
                    │ Layered Content (z-index: 10)
                    ▼
┌────────────────────────────────────────────────────────┐
│  Floating Transparent Content & Glassmorphism Cards   │
│  - Hero Section: Floating text (No background card)    │
│  - Story/Descent/Brew/Pour: Frosted glass cards       │
│  - Fast Staggered Word & Shimmer Reveals              │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Step-by-Step Implementation Guide

### 1. Frame Sequence Extraction (Replacing Video Seeking Lag)
Never rely on setting `video.currentTime` directly on HTML5 `<video>` tags — inter-frame H.264 compression causes seeking stalls and browser autoplay blocks. Instead, extract video frames into a high-quality JPG image sequence:

```bash
# Extract frames at maximum quality (q:v 2) into public/frames/
mkdir -p public/frames
ffmpeg -y -i public/source_video.mp4 -q:v 2 public/frames/frame_%03d.jpg
```

---

### 2. 60 FPS Canvas Scroll Engine (`CanvasFrameScrollBackground.tsx`)
Preload all frames into memory and render them on a `<canvas>` element using GSAP ScrollTrigger:

```tsx
import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const TOTAL_FRAMES = 240;

interface CanvasProps {
  onProgress?: (progress: number) => void;
}

export default function CanvasFrameScrollBackground({ onProgress }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // 1. Preload image sequence into memory
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/frames/frame_${frameNum}.jpg`;
      img.onload = () => {
        count++;
        if (onProgress) onProgress((count / TOTAL_FRAMES) * 100);
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, [onProgress]);

  // 2. Object-fit cover canvas render loop bound to GSAP ScrollTrigger
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrameRef.current);
    };

    const currentFrameRef = { current: 0 };

    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || !ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const hRatio = w / img.width;
      const vRatio = h / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const shiftX = (w - img.width * ratio) / 2;
      const shiftY = (h - img.height * ratio) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, img.width, img.height, shiftX, shiftY, img.width * ratio, img.height * ratio);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const ctxGsap = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(self.progress * TOTAL_FRAMES))
          );
          currentFrameRef.current = frameIndex;
          renderFrame(frameIndex);
        },
      });
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      ctxGsap.revert();
    };
  }, []);

  return (
    <motion.div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-bg-aurea">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-aurea via-bg-aurea/30 to-bg-aurea/60 pointer-events-none" />
    </motion.div>
  );
}
```

---

### 3. Glassmorphism Card Backdrops & Hero Floating Text
To ensure text is 100% legible over the continuous canvas video:
- **Hero Section**: Float text **without a card background** so the opening video scene is un-obscured.
- **Content Steps**: Wrap text blocks in faint frosted glass cards (`bg-bg-card/55 backdrop-blur-xl border border-border-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-8 rounded-3xl`).

---

### 4. Text Reveal & Shimmer Animations
For fast, responsive Awwwards-style text reveals:

```tsx
// Fast & snappy word reveal variants
const wordContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

const wordItemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)", scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};
```

#### Gold Shimmer CSS (`index.css`):
```css
@keyframes goldShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.text-gold-shimmer {
  background: linear-gradient(
    110deg,
    #b89430 0%,
    #e5c158 25%,
    #fff5d6 50%,
    #e5c158 75%,
    #b89430 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: goldShimmer 6s linear infinite;
}
```

---

### 5. Luxury Preloader Screen (`LuxuryPreloader.tsx`)
Create a preloader curtain that tracks loading progress and exits with a luxury bezier curve:

```tsx
<AnimatePresence>
  {!isDone && (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] bg-bg-aurea flex flex-col items-center justify-between p-10"
    >
      <h1 className="font-serif text-8xl font-bold text-gold-shimmer">BRAND</h1>
      <div className="w-72 h-[2px] bg-border-gold overflow-hidden">
        <motion.div className="h-full bg-aurea-gold" animate={{ width: `${progress}%` }} />
      </div>
      <div>{Math.round(progress)}%</div>
    </motion.div>
  )}
</AnimatePresence>
```

---

## ⚠️ Key Precautions & Best Practices

1. **Avoid `<video>` scrubbing directly**: Always convert videos to JPG frame sequences (`public/frames/frame_%03d.jpg`) for zero seeking lag and 60 FPS scroll performance.
2. **Motion Easing Types**: Never pass raw arrays `ease: [0.16, 1, 0.3, 1]` inside Motion variants objects — TypeScript will throw a compilation error. Use `"easeOut" as const` or pass cubic-bezier to `transition={{ ease: [0.16, 1, 0.3, 1] }}` on the `<motion.div>` component directly.
3. **Text Stagger Timing**: Keep `staggerChildren` between `0.03s` and `0.05s` and transition duration around `0.4s`. Avoid slow `0.9s+` staggers that make text feel sluggish.
4. **Hero Background Hiding**: Keep the main hero text floating without a card background box (`bg-bg-card`), while adding faint frosted glass cards (`backdrop-blur-xl bg-bg-card/55`) to subsequent content steps.
5. **Git Repository Setup**: Always configure `git config user.name` and `git config user.email` before initial commit.
