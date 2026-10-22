"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeartPulse, UserGroup } from "lucide-react";
import Link from "next/link";

const heroVideo1WebM = "/hero_video_1.webm";
const heroVideo2WebM = "/hero_video_2.webm";
const heroVideo3WebM = "/hero_video_3.webm";

const slides = [
  {
    id: 1,
    videoSrcWebm: heroVideo1WebM,
    poster: "/postar1.webp",
    alt: "Sick women on the hospital bed receving blood.",
  },
  {
    id: 2,
    videoSrcWebm: heroVideo2WebM,
    poster: "/postar2.webp",
    alt: "Paramedical team helping a patient",
  },
  {
    id: 3,
    videoSrcWebm: heroVideo3WebM,
    poster: "/postar3.webp",
    alt: "Man and woman walking in the park",
  },
];

const waveEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

const slideVariants: Variants = {
  initial: {
    clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    scale: 1.05,
  },
  animate: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    scale: 1,
    transition: { duration: 1.2, ease: waveEase },
  },
  exit: {
    clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    scale: 0.95,
    transition: { duration: 0.8, ease: waveEase },
  },
};

const stats = [
  {
    id: 1,
    title: "24/7 Emergency Support",
    sub: " Help when it matters most",
  },
  {
    id: 2,
    title: "Verified Donors",
    sub: " Connect with trusted donors",
  },
  {
    id: 3,
    title: "Fast Response",
    sub: "Get help when you need it",
  },
];

const VideoSlide = ({
  srcWebm,
  poster,
  isActive,
  alt,
}: {
  srcWebm: string;
  poster: string;
  isActive: boolean;
  alt: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current
        .play()
        .catch((error) => console.warn("Autoplay prevented:", error));
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className="w-full h-full object-cover object-center"
      aria-label={alt}
    >
      <source src={srcWebm} type="video/webm" />
    </video>
  );
};

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    // FIX: Use 100dvh for mobile browser compatibility
    <section className="relative w-full h-dvh min-h-150 overflow-hidden bg-black text-white">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0 perspective-[1000px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full origin-right will-change-[transform,clip-path]"
            style={{ transformOrigin: "right center" }}
          >
            <VideoSlide
              srcWebm={slides[currentIndex].videoSrcWebm}
              poster={slides[currentIndex].poster}
              isActive={true}
              alt={slides[currentIndex].alt}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay - Fixed bg-gradient typo */}
        <div className="absolute inset-0 z-20 bg-linear-to-r from-black/60 via-black/30 to-black/60 pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-30 flex flex-col justify-center items-start h-full container-main pointer-events-none">
        {/* Text Block - Adjusted margins and text sizes for mobile */}
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-white/20 backdrop-blur-lg rounded-full text-xs md:text-sm font-medium tracking-wide mb-4 md:mb-6 font-graphik"
          >
            Life Share
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-financier text-5xl md:text-6xl lg:text-7xl font-light italic mb-4 md:mb-6"
          >
            Be the reason <br /> someone survives.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-graphik text-white/90 font-light max-w-xl mb-8 md:mb-10 leading-relaxed"
          >
            Every drop matters. Connect with nearby blood donors, request blood
            in an emergency, and help save lives when every second counts.
          </motion.p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 pointer-events-auto">
            <Button size={"lg"} className="btn-main bg-[#B15A36]">
              <UserGroup />
              <Link href={"/donors"}>
                Find donors
              </Link>
            </Button>
            <Button variant={"secondary"} className="btn-sec">
              <HeartPulse />
              <Link href={"/blood-requesters"}>
                Request blood
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden md:flex flex-wrap gap-6 md:gap-12 mt-10">
          {stats.map((stat, i) => (
            <React.Fragment key={stat.id}>
              {i > 0 && (
                <div className="hidden md:block w-px bg-white/30 h-12 self-center" />
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex flex-col"
              >
                <span className="text-xl md:text-2xl font-light font-financier">
                  {stat.title}
                </span>
                <span className="text-sm text-white/80 mt-1 font-graphik">
                  {stat.sub}
                </span>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
