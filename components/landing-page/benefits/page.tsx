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
        <div className="w-10 h-10 relative overflow-hidden flex justify-center items-center">
          <GoShieldLock className="w-8 h-8 " />
        </div>
      ),
    },
    {
      title: "Simplified Exam Creation",
      description:
        "Effortlessly create, schedule, and manage exams with our intuitive platform and question bank",
      icon: (
        <div className="w-10 h-10 relative overflow-hidden flex justify-center items-center">
          <GoChecklist className="w-8 h-8 " />
        </div>
      ),
    },
    {
      title: "Scalable and Reliable",
      description: "Scalable and reliable for exams, from 50 to 5000 students.",
      icon: (
        <div className="w-10 h-10 relative overflow-hidden flex justify-center items-center">
          <GoGitBranch className="w-9 h-8" />
        </div>
      ),
    },
    {
      title: "Seamless User Experience",
      description:
        "Both instructors and students enjoy a user-friendly interface that simplifies exam management and participation.",
      icon: (
        <div className="w-10 h-10 relative overflow-hidden flex justify-center items-center">
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
        <div className="w-10 h-10 relative overflow-hidden flex justify-center items-center">
          <GoGraph className="w-9 h-8" />
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
      <div className="bg-gradient-to-l from-cyan-400/78 to-cyan-500/10 p-0.5 rounded-3xl hover:scale-102  transition-all duration-300 ease-in-out hover:bg-gradient-to-tr ">
        <div
          className={`w-full md:w-auto ${
            wide ? "md:flex-1 md:min-w-[45%]" : "md:w-64 lg:w-full"
          } px-5 md:px-7 py-8 md:py-11 bg-gradient-to-l from-stone-700/100 to-black/100 rounded-3xl shadow-[inset_0px_-9px_4px_0px_rgba(237,225,225,0.10)] flex flex-col justify-start items-start gap-2.5 overflow-hidden  hover:bg-gradient-to-tr hover:from-black/100 hover:to-stone-700/100`}
        >
          <div className="flex flex-col justify-center md:justify-start items-center md:items-start gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 p-2 bg-gradient-to-b from-cyan-400/60 to-cyan-600/60 rounded-full shadow-[inset_0px_-4px_4px_0px_rgba(255,255,255,0.26)] outline outline-1 outline-offset-[-1px] outline-cyan-400/50 flex justify-center items-center">
              {icon}
            </div>
            <div className="flex flex-col justify-center md:justify-start items-center md:items-start gap-3 md:gap-4">
              <div className="text-white text-lg md:text-xl font-semibold">
                {title}
              </div>
              <div className="text-white/80 text-xs md:text-sm font-normal text-center md:text-start">
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen md:p-8 gap-14">
      <div className="flex flex-col items-center justify-center gap-8 md:gap-11">
        <Tag label="Benefits" />
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
          <div className="self-stretch text-center justify-start text-white text-2xl md:text-4xl font-bold">
            Why Choose Our Exam Platform?
          </div>
          <div className="text-gray-400 text-sm md:text-lg font-base text-center max-w-4xl mx-auto leading-relaxed">
            Discover the Powerful Features and Benefits that Set Our Exam
            Platform Apart, Ensuring Seamless and Secure Exam Management for
            Both Instructors and Students
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl flex flex-col justify-start items-stretch gap-6 md:gap-12">
        <div className="flex flex-col md:flex-row justify-start items-stretch gap-6 md:gap-12">
          {benefitsData.slice(0, 3).map((benefit, index) => (
            <BenefitCard
              key={index}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-start items-stretch gap-6 md:gap-12">
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
    </div>
  );
}

export default Benefits;
