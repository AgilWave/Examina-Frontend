import React from "react";

export default function FeaturesSection() {
  return (
    <section className="bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Features pill */}
        <div className="flex justify-center mb-4">
          <div className="bg-cyan-900/30 text-cyan-400 px-6 py-2 rounded-full inline-block">
            Features
          </div>
        </div>
        
        {/* Main heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Powerful Features Designed for Educational Institutions
          </h2>
        </div>
        
        {/* Feature cards - first row */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* User Management Card */}
          <div className="w-full md:w-96 h-96 relative bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_6px_4.4px_0px_rgba(0,0,0,0.57)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2">
            <img 
              className="w-full h-96 object-cover object-center" 
              src="/imgs/usermi.png" 
              alt="User Management"
            />
            <div className="absolute left-0 top-0 w-full h-full p-8 flex flex-col">
              <div className="text-center text-white text-xl font-bold ">
                Seamless User Management
              </div>
              <div className="mt-4 text-center text-white/80 text-xs font-normal ">
                Assign roles and restrict access to exam creation, management, grading, and sensitive data
              </div>
            </div>
          </div>
          
          {/* AI Monitoring Card */}
          <div className="w-full md:w-[733px] h-96 relative bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_6px_4.4px_0px_rgba(0,0,0,0.57)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2">
            <img 
              className="w-full h-full object-cover" 
              src="/imgs/monitoring.png" 
              alt="AI Monitoring"
            />
            <div className="absolute left-0 top-0 w-full h-full p-8 flex flex-col">
              <div className="text-center text-white text-xl font-bold ">
                Ensure Integrity with AI-Driven Monitoring
              </div>
              <div className="mt-4 text-center text-white/80 text-xs font-normal  max-w-[653px] mx-auto">
                Our platform uses AI to monitor exams, flagging suspicious activities like cheating. Real-time alerts ensure fair, secure assessments.
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature cards - second row */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Question Banks Card */}
          <div className="w-full md:w-[733px] h-96 relative bg-gradient-to-br from-cyan-500/20 to-black/15 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_6px_4.4px_0px_rgba(0,0,0,0.57)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2">
            <img 
              className="w-full h-80 object-cover absolute bottom-0" 
              src="/imgs/qb.png" 
              alt="Question Banks"
            />
            <div className="absolute left-0 top-0 w-full h-full p-8 flex flex-col">
              <div className="text-center text-white text-xl font-bold ">
                Create Exams Effortlessly with Built-in Question Banks
              </div>
              <div className="mt-4 text-center text-white/80 text-xs font-normal  max-w-[652px] mx-auto">
                Easily design and schedule exams using our question bank or custom questions. Set time limits, randomize questions, and automate grading to save time
              </div>
            </div>
          </div>
          
          {/* Insights Card */}
          <div className="w-full md:w-96 h-96 relative bg-gradient-to-br from-cyan-500/15 to-black/20 hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 rounded-[38px] shadow-[0px_0px_10px_0px_rgba(38,254,253,0.4)] hover:shadow-[0px_0px_12px_0px_rgba(38,254,253,0.5)] shadow-[inset_0px_6px_4.4px_0px_rgba(0,0,0,0.57)] outline outline-[1.5px] outline-offset-[-1.5px] outline-cyan-400/50 hover:outline-cyan-400/70 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2">
            <img 
              className="w-full h-72 object-contain absolute bottom-0" 
              src="/imgs/insights.png" 
              alt="Insights"
            />
            <div className="absolute left-0 top-0 w-full h-full p-8 flex flex-col">
              <div className="text-center text-white text-xl font-bold ">
                Instant Feedback and Insights
              </div>
              <div className="mt-4 text-center text-white/80 text-xs font-normal ">
                Instant results for students, analytics for instructors to track trends and refine teaching.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}