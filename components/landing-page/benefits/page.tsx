import React from "react";
import {
  GoChecklist,
  GoShieldLock,
  GoGitBranch,
  GoZap,
  GoGraph,
} from "react-icons/go";
import Tag from "../_components/tag";

interface BenefitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  wide?: boolean;
}

function Benefits() {
  const benefitsData = [
    {
      title: "Maximum Security",
      description:
        "AI proctoring ensures fair exams role-based access secures data",
      icon: (
        <div className="w-10 h-10 flex justify-center items-center">
          <GoShieldLock className="w-8 h-8" />
        </div>
      ),
    },
    {
      title: "Simplified Exam Creation",
      description:
        "Effortlessly create, schedule, and manage exams with our intuitive platform and question bank",
      icon: (
        <div className="w-10 h-10 flex justify-center items-center">
          <GoChecklist className="w-8 h-8" />
        </div>
      ),
    },
    {
      title: "Scalable and Reliable",
      description: "Scalable and reliable for exams, from 50 to 5000 students.",
      icon: (
        <div className="w-10 h-10 flex justify-center items-center">
          <GoGitBranch className="w-8 h-8" />
        </div>
      ),
    },
    {
      title: "Seamless User Experience",
      description:
        "Both instructors and students enjoy a user-friendly interface that simplifies exam management and participation.",
      icon: (
        <div className="w-10 h-10 flex justify-center items-center">
          <GoZap className="w-8 h-8" />
        </div>
      ),
      wide: true,
    },
    {
      title: "Real-Time Analytics",
      description:
        "Gain deep insights into student performance to inform future exams and teaching strategies.",
      icon: (
        <div className="w-10 h-10 flex justify-center items-center">
          <GoGraph className="w-8 h-8" />
        </div>
      ),
      wide: true,
    },
  ];

  const BenefitCard = ({
    title,
    description,
    icon,
    wide = false,
  }: BenefitCardProps) => {
    return (
     
      <div className="w-full h-full px-5 md:px-7 py-8 md:py-11 bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_-4px_4px_0px_rgba(255,255,255,0.26)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 ">
        <div className="flex flex-col justify-center md:justify-start items-center md:items-start gap-6 w-full">
          <div className="w-12 h-12 md:w-14 md:h-14 p-2 bg-gradient-to-b from-cyan-400/60 to-cyan-600/60 rounded-full shadow-[inset_0px_-4px_4px_0px_rgba(255,255,255,0.26)] outline outline-1 outline-offset-[-1px] outline-cyan-400/50 flex justify-center items-center">
            {icon}
          </div>
          <div className="flex flex-col justify-center md:justify-start items-center md:items-start gap-3 md:gap-4 w-full">
            <div className="text-white text-lg md:text-xl font-semibold">
              {title}
            </div>
            <div className="text-white/80 text-xs md:text-sm font-normal text-center md:text-left">
              {description}
            </div>
          </div>
        </div>
      </div>
    
    );
  };
  return (
    <section className="flex flex-col items-center justify-center w-full py-16 px-4 md:px-8 gap-14">
      <div className="flex flex-col items-center justify-center gap-8 md:gap-11">
        <Tag label="Benefits" />
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
          <h2 className="text-white text-2xl md:text-4xl font-bold text-center">
            Why Choose Our Exam Platform?
          </h2>
          <p className="text-gray-400 text-sm md:text-lg font-normal text-center max-w-4xl mx-auto leading-relaxed">
            Discover the Powerful Features and Benefits that Set Our Exam
            Platform Apart, Ensuring Seamless and Secure Exam Management for
            Both Instructors and Students
          </p>
        </div>
      </div>
      <div className="w-full max-w-6xl flex flex-col justify-start items-stretch gap-6 md:gap-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {benefitsData.slice(0, 3).map((benefit, index) => (
            <BenefitCard
              key={index}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {benefitsData.slice(3, 5).map((benefit, index) => (
            <BenefitCard
              key={index + 3}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
              wide={benefit.wide}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;
