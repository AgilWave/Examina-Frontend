"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import univeristyLight from "@/public/imgs/dashboard/light/nibmdeskcolor.png";
import university from "@/public/imgs/unidashboard.png";
import { useTheme } from "next-themes";

export const LoadingScreen = ({
  onLoadingComplete,
}: {
  onLoadingComplete: () => void;
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logo = currentTheme === "light" ? univeristyLight : university;

  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          duration: 0.5,
        }}
      >
        <Image
          src={logo}
          alt="Loading Logo"
          width={250}
          height={150}
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="w-8 h-8 border-4 border-[#0db0ad] dark:border-[#00928F] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};
