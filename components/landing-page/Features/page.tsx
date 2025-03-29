import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import userManagementIMG from "@/public/imgs/usermi.png";
import monitoringIMG from "@/public/imgs/monitoring.png";
import QBIMG from "@/public/imgs/qb.png";
import InsightsIMG from "@/public/imgs/insights.png";
import Tag from "../_components/tag";

export default function FeaturesSection() {
  const titleControls = useAnimation();
  const firstRowControls = useAnimation();
  const secondRowControls = useAnimation();
  
  const [titleRef, titleInView] = useInView({
    threshold: 0.1,
    triggerOnce: false 
  });
  
  const [firstRowRef, firstRowInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const [secondRowRef, secondRowInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (titleInView) {
      titleControls.start("visible");
    } else {
      titleControls.start("hidden");
    }
  }, [titleControls, titleInView]);

  useEffect(() => {
    if (firstRowInView) {
      firstRowControls.start("visible");
    } else {
      firstRowControls.start("hidden");
    }
  }, [firstRowControls, firstRowInView]);

  useEffect(() => {
    if (secondRowInView) {
      secondRowControls.start("visible");
    } else {
      secondRowControls.start("hidden");
    }
  }, [secondRowControls, secondRowInView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3 
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <section className="bg-black text-white pb-8 pt-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8">
        <motion.div 
          ref={titleRef}
          className="flex flex-col items-center justify-center gap-8 md:gap-11"
          initial="hidden"
          animate={titleControls}
          variants={titleVariants}
        >
          <Tag label="Features" />
          <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
            <h2 className="text-white text-2xl md:text-4xl font-bold text-center">
              Powerful Features Designed for Educational Institutions{" "}
            </h2>
            <p className="text-gray-400 text-sm md:text-lg font-normal text-center max-w-4xl mx-auto leading-relaxed">
              Empowering Educational Institutions with Seamless Administration,
              Secure Assessments, and Engaging Learning Experience
            </p>
          </div>
        </motion.div>

        <motion.div 
          ref={firstRowRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8  w-full"
          initial="hidden"
          animate={firstRowControls}
          variants={containerVariants}
        >
          <motion.div 
            className="md:col-span-4 h-96 relative bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[48px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_6px_4.4px_0px_rgba(0,0,0,0.57)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2"
            variants={itemVariants}
          >
            <div className="relative w-full h-full">
              <Image
                className="w-full h-full object-cover"
                src={userManagementIMG}
                alt="User Management"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 flex flex-col justify-start p-8">
                <div className="text-center text-white text-xl font-bold mb-4">
                  Seamless User Management
                </div>
                <div className="text-center text-white/80 text-xs font-normal">
                  Assign roles and restrict access to exam creation, management,
                  grading, and sensitive data
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="md:col-span-8 h-96 relative bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[48px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_6px_4.4px_0px_rgba(0,0,0,0.57)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2"
            variants={itemVariants}
          >
            <div className="relative w-full h-full">
              <Image
                className="w-full h-full object-cover"
                src={monitoringIMG}
                alt="AI Monitoring"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 flex flex-col justify-start p-8">
                <div className="text-center text-white text-xl font-bold mb-4">
                  Ensure Integrity with AI-Driven Monitoring
                </div>
                <div className="text-center text-white/80 text-xs font-normal mx-auto max-w-3xl">
                  Our platform uses AI to monitor exams, flagging suspicious
                  activities like cheating. Real-time alerts ensure fair, secure
                  assessments.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          ref={secondRowRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full"
          initial="hidden"
          animate={secondRowControls}
          variants={containerVariants}
        >
          <motion.div 
            className="md:col-span-8 h-96 relative bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[48px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_6px_4.4px_0px_rgba(0,0,0,0.57)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2"
            variants={itemVariants}
          >
            <div className="relative w-full h-full">
              <Image
                className="w-full h-full object-cover pt-20 md:pt-8"
                src={QBIMG}
                alt="Question Banks"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 flex flex-col justify-start p-8">
                <div className="text-center text-white text-xl font-bold mb-4">
                  Create Exams Effortlessly with Built-in Question Banks
                </div>
                <div className="text-center text-white/80 text-xs font-normal mx-auto max-w-3xl">
                  Easily design and schedule exams using our question bank or
                  custom questions. Set time limits, randomize questions, and
                  automate grading to save time
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="md:col-span-4 h-96 relative bg-gradient-to-br from-cyan-500/15 to-black/20 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[48px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_6px_4.4px_0px_rgba(0,0,0,0.57)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2"
            variants={itemVariants}
          >
            <div className="relative w-full h-full">
              <div className="absolute bottom-0 w-full pt-20">
                <Image
                  className="w-full h-full object-cover "
                  src={InsightsIMG}
                  alt="Insights"
                  width={400}
                  height={400}
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-start p-8">
                <div className="text-center text-white text-xl font-bold mb-4">
                  Instant Feedback and Insights
                </div>
                <div className="text-center text-white/80 text-xs font-normal">
                  Instant results for students, analytics for instructors to
                  track trends and refine teaching.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}