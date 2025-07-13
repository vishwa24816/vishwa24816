
"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronsRight } from 'lucide-react';

interface SwipeButtonProps {
  onConfirm: () => void;
  text?: string;
  confirmText?: string;
}

export const SwipeButton: React.FC<SwipeButtonProps> = ({
  onConfirm,
  text = "Swipe to Place Order",
  confirmText = "Order Placed",
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    if (info.offset.x > 150) { // Adjust threshold as needed
      setIsConfirmed(true);
      onConfirm();
    }
  };

  return (
    <div ref={constraintsRef} className="relative w-full h-14 bg-primary/20 rounded-full flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {!isConfirmed && (
          <motion.p
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-primary font-medium z-10 select-none pointer-events-none"
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfirmed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-primary font-medium z-10 select-none pointer-events-none flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            {confirmText}
          </motion.p>
        )}
      </AnimatePresence>

      {!isConfirmed && (
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          onDragEnd={handleDragEnd}
          dragElastic={0}
          dragSnapToOrigin
          className="absolute left-1 top-1 h-12 w-12 bg-primary rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center z-20"
          whileTap={{ scale: 1.1 }}
        >
          <ChevronsRight className="h-6 w-6 text-primary-foreground" />
        </motion.div>
      )}
    </div>
  );
};
