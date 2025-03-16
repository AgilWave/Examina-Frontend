import React from 'react';
import Image from 'next/image';
import Line1Png from '../../../public/imgs/Line1.png';
import Line2Png from '../../../public/imgs/Line2.png';
import Line3Png from '../../../public/imgs/Line3.png';
import Line4Png from '../../../public/imgs/Line4.png';

export default function Process() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-2 inline-block"></div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-10 lg:mb-16 text-center">How Our Platform Works</h1>

      <div className="w-full max-w-6xl mx-auto relative">

        <div className="w-full md:w-80 h-48 px-8 py-3 md:absolute md:-left-10 md:top-[60px] bg-gradient-to-l from-stone-500/30 to-black/10 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-cyan-500/50 flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200" />
          <div className="text-center text-white text-xl font-semibold">Account Setup</div>
          <div className="text-center text-white text-sm font-normal">
            Sign up and customize your platform. Assign user roles and upload your institution's question banks.
          </div>
          <div className="absolute left-[152.5px] top-[28px] text-center text-cyan-400/95 text-2xl font-semibold">1</div>
        </div>

        <div className="w-full md:w-80 h-48 px-8 py-3 md:absolute md:left-[220px] md:top-[337px] bg-gradient-to-l from-teal-700/50 to-black/10 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-cyan-500/50 flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200" />
          <div className="text-center text-white text-xl font-semibold">Create Exams</div>
          <div className="text-center text-white text-sm font-normal">
            Create exams with an intuitive interface using our question bank or custom questions. Set time limits, randomization, and proctoring rules.
          </div>
          <div className="absolute left-[153.5px] top-[18px] text-center text-cyan-400/95 text-2xl font-semibold">2</div>
        </div>

        <div className="w-full md:w-80 h-48 px-8 py-3 md:absolute md:left-[430px] md:top-0 bg-gradient-to-l from-stone-500/30 to-black/10 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-cyan-500/50 flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200" />
          <div className="text-center text-white text-xl font-semibold">Student Access</div>
          <div className="text-center text-white text-sm font-normal">
            Students access exams via secure login. They can upload required documents, pass security checks, and start the exam on their scheduled time.
          </div>
          <div className="absolute left-[153px] top-[19px] text-center text-cyan-400/95 text-2xl font-semibold">3</div>
        </div>

        <div className="w-full md:w-96 h-48 px-8 py-3 md:absolute md:left-[670px] md:top-[337px] bg-gradient-to-l from-teal-700/50 to-black/10 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-cyan-500/50 flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200" />
          <div className="text-center text-white text-xl font-semibold">Proctoring & Monitoring</div>
          <div className="text-center text-white text-sm font-normal">
            AI monitors students in real-time to ensure integrity, flagging suspicious behavior and alerting proctors.
          </div>
          <div className="absolute left-[184px] top-[38px] text-center text-cyan-400/95 text-2xl font-semibold">4</div>
        </div>

        <div className="w-full md:w-80 h-48 px-8 py-3 md:absolute md:left-[880px] md:top-[42px] bg-gradient-to-l from-stone-500/30 to-black/10 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-cyan-500/50 flex flex-col justify-center items-center gap-2 mb-8 md:mb-0">
          <div className="w-11 h-11 bg-gradient-to-br from-neutral-100 to-neutral-400/0 rounded-full border border-gray-200" />
          <div className="text-center text-white text-xl font-semibold">Instant Grading & Results</div>
          <div className="text-center text-white text-sm font-normal">
            After the exam, results are auto-graded with instant feedback. Instructors get detailed performance analytics.
          </div>
          <div className="absolute left-[153px] top-[28px] text-center text-cyan-400/95 text-2xl font-semibold">5</div>
        </div>

        <div className="hidden md:block">
          <Image src={Line1Png} alt="Line 1" className="w-43 h-55 absolute left-[50px] top-[253px] origin-top-left rotate-[1.02deg]" />
          <Image src={Line2Png} alt="Line 2" className="w-30 h-80 absolute left-[305px] top-[30px] origin-top-left rotate-[-10.02deg]" />
          <Image src={Line3Png} alt="Line 3" className="w-30 h-74 absolute left-[745px] top-[67px] origin-top-left rotate-[-10.02deg]" />
          <Image src={Line4Png} alt="Line 4" className="w-30 h-50 absolute left-[1020px] top-[245px] origin-top-left rotate-[-10.02deg]" />
        </div>
      </div>
    </div>
  );
}