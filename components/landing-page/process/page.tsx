import React from 'react';
import Image from 'next/image';
import Line1Png from '../../../public/imgs/Line1.png';
import Line2Png from '../../../public/imgs/Line2.png';
import Line3Png from '../../../public/imgs/Line3.png';
import Line4Png from '../../../public/imgs/Line4.png';
import Tag from '../_components/tag';

export default function Process() {
  return (
    <div className="bg-black text-white flex flex-col items-center justify-center px-4 py-12 gap-14">
      <div className="flex flex-col items-center justify-center gap-8 md:gap-11">
        <Tag label="How It Works" />
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
          <div className="self-stretch text-center justify-start text-white text-2xl md:text-4xl font-bold">
            How Our Platform Works
          </div>
          <div className="text-gray-400 text-sm md:text-lg font-base text-center max-w-4xl mx-auto leading-relaxed">
            Explore how our platform streamlines exams with secure, seamless management for instructors and students.
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative min-h-[800px] md:min-h-[600px]">
        <div className="w-full xl:w-59 2xl:w-80 h-48 px-8 py-3 md:absolute md:-left-10 md:top-[60px] bg-gradient-to-br from-gray-600/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_-4px_4px_0px_rgba(255,255,255,0.26)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 xl:w-9 xl:h-9 2xl:w-11 2xl:h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200 flex items-center justify-center text-cyan-300 text-2xl font-semibold">
            1
          </div>
          <div className="text-center text-white text-lg xl:text-md 2xl:text-xl font-semibold">Account Setup</div>
          <div className="text-center text-gray-300  text-xs 2xl:text-sm font-normal">
            Sign up and customize your platform. Assign user roles and upload your institution&apos;s question banks.
          </div>
        </div>

        <div className="w-full xl:w-60 2xl:w-80 h-48 px-8 py-3 md:absolute xl:left-[180px] 2xl:left-[220px] md:top-[337px] bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_-4px_4px_0px_rgba(255,255,255,0.26)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 xl:w-9 xl:h-9 2xl:w-11 2xl:h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200 flex items-center justify-center text-cyan-300 text-2xl font-semibold">
            2
          </div>
          <div className="text-center text-white text-lg xl:text-md 2xl:text-xl  font-semibold">Create Exams</div>
          <div className="text-center text-gray-300 text-xs 2xl:text-sm font-normal">
            Create exams with an intuitive interface using our question bank or custom questions. Set time limits, randomization, and proctoring rules.
          </div>
        </div>

        <div className="w-full xl:w-60 2xl:w-80 h-48 px-8 py-3 md:absolute xl:left-[385px] 2xl:left-[430px] md:top-0 bg-gradient-to-br from-gray-600/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_-4px_4px_0px_rgba(255,255,255,0.26)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2  flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 xl:w-9 xl:h-9 2xl:w-11 2xl:h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200 flex items-center justify-center text-cyan-300 text-2xl font-semibold">
            3
          </div>
          <div className="text-center text-white text-lg xl:text-md 2xl:text-xl  font-semibold">Student Access</div>
          <div className="text-center text-gray-300 text-xs 2xl:text-sm font-normal">
            Students access exams via secure login. They can upload required documents, pass security checks, and start the exam on their scheduled time.
          </div>
        </div>

        <div className="w-full xl:w-60 2xl:w-96 h-48 px-8 py-3 md:absolute xl:left-[620px] 2xl:left-[670px] md:top-[337px] bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_-4px_4px_0px_rgba(255,255,255,0.26)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 xl:w-9 xl:h-9 2xl:w-11 2xl:h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200 flex items-center justify-center text-cyan-300 text-2xl font-semibold">
            4
          </div>
          <div className="text-center text-white text-lg xl:text-md 2xl:text-xl  font-semibold">Proctoring & Monitoring</div>
          <div className="text-center text-gray-300  text-xs 2xl:text-sm font-normal">
            AI monitors students in real-time to ensure integrity, flagging suspicious behavior and alerting proctors.
          </div>
        </div>

        <div className="w-full xl:w-60 2xl:w-80 h-48 px-8 py-3 md:absolute xl:left-[790px] 2xl:left-[880px] md:top-[42px] bg-gradient-to-br from-gray-600/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_-4px_4px_0px_rgba(255,255,255,0.26)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2  flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 xl:w-9 xl:h-9 2xl:w-11 2xl:h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200 flex items-center justify-center text-cyan-300 text-2xl font-semibold">
            5
          </div>
          <div className="text-center text-white text-lg xl:text-md 2xl:text-xl  font-semibold">Instant Grading & Results</div>
          <div className="text-center text-gray-300  text-xs 2xl:text-sm font-normal">
            After the exam, results are auto-graded with instant feedback. Instructors get detailed performance analytics.
          </div>
        </div>

        <div className="hidden md:block">
          <Image src={Line1Png} alt="Line 1" className="w-43 h-55 absolute xl:left-[12px] 2xl:left-[50px] top-[253px] origin-top-left rotate-[1.02deg]" />
          <Image src={Line2Png} alt="Line 2" className="w-30 h-80 absolute xl:left-[260px]  2xl:left-[305px] top-[30px] origin-top-left rotate-[-10.02deg]" />
          <Image src={Line3Png} alt="Line 3" className="w-30 h-74 absolute xl:left-[615px] 2xl:left-[745px] top-[67px] origin-top-left rotate-[-10.02deg]" />
          <Image src={Line4Png} alt="Line 4" className="w-30 h-50 absolute left-[825px] 2xl:left-[1020px] top-[245px] origin-top-left rotate-[-10.02deg]" />
        </div>
      </div>
    </div>
  );
}