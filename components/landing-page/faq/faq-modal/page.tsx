import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQCardProps {
  question: string;
  answer: string;
}

const FAQCard = ({ question, answer }: FAQCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ height: "auto" }}
      animate={{ 
        height: isExpanded ? "auto" : "auto",
        transition: { 
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
      className={`
        relative 
        bg-gradient-to-br from-cyan-500/20 to-black/15
        rounded-4xl
        outline 
        outline-1 
        outline-offset-[-1px] 
        outline-cyan-700 
        overflow-hidden 
      `}
    >
      <div className="w-full left-[28px] top-[20px] flex flex-col justify- items-start gap-5 p-7">
        <div
          className="
            text-white 
            text-lg 
            font-bold 
            cursor-pointer
            flex 
            items-center 
            justify-between
            w-full
          "
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {question}
          {isExpanded ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ 
                opacity: 0,
                height: 0
              }}
              animate={{ 
                opacity: 1,
                height: "auto"
              }}
              exit={{ 
                opacity: 0,
                height: 0
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="
                justify-start 
                text-[#ffffffef] 
                text-opacity-80 
                text-sm 
                font-normal 
                overflow-hidden
              "
            >
              {answer}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FAQCard;