import type { Variants } from "motion/react";
import { motion } from "motion/react";

export default function ProgressBadge({
  progress,
  icon,
}: {
  progress: number;
  icon: React.ReactNode;
}) {
  const pathLength = progress / 100;
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: () => {
      return {
        pathLength: pathLength,
        opacity: 1,
        transition: {
          pathLength: {
            type: "spring",
            duration: 1.5,
            bounce: 0.3,
          },
          opacity: { duration: 0.01 },
        },
      };
    },
  };

  return (
    <div>
      <div className="relative flex h-22.5 w-22.5 items-center justify-center">
        <motion.svg
          className="absolute -rotate-90"
          width="90"
          height="90"
          viewBox="0 0 112 112"
          initial="hidden"
          animate="visible"
        >
          {/* radial progress empty bar */}
          <circle
            cx="56"
            cy="56"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-900"
          />
          {/* radial progress filled bar */}
          <motion.circle
            cx="56"
            cy="56"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            pathLength={pathLength}
            strokeLinecap="round"
            className="text-green-500"
            variants={draw}
          />
        </motion.svg>

        {/* centered content showing icon and progress */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-full">
          {icon}
          <span className="text-xs font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
