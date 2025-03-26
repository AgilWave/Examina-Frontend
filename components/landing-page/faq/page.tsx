import React from "react";
import Tag from "../_components/tag";
import FAQCard from "./faq-modal/page";

function page() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 md:gap-11">
      <Tag label="FAQ" />

      <h1 className="text-4xl md:text-5xl font-semibold text-white text-center">
        Frequently Asked Questions
      </h1>

      <p className="text-gray-400 text-sm md:text-lg font-normal text-center max-w-4xl mx-auto leading-relaxed">
        Discover the answers to common questions about our exam platform,
        including features, security, and support. Get the information you need
        to make an informed decision.
      </p>

      <div className="w-full max-w-6xl flex flex-col justify-start items-stretch gap-6 md:gap-12">
        <div className="flex flex-col justify-start items-stretch gap-6 md:gap-12">
          <FAQCard
            question="What is the purpose of this exam platform?"
            answer="The exam platform is designed to facilitate secure and efficient online examinations for educational institutions, ensuring a seamless experience for both instructors and students."
          />
          <FAQCard
            question="How does the exam proctoring system work?"
            answer="The exam proctoring system uses advanced AI technology to monitor students during exams, ensuring integrity and preventing cheating through real-time analysis of behavior and environment."
          />
            <FAQCard
                question="What types of assessments can be conducted on the platform?"
                answer="The platform supports various types of assessments, including multiple-choice questions, essay-type questions, and practical exams, catering to diverse educational needs."
            />
            <FAQCard
                question="Is the platform secure and reliable?"
                answer="Yes, the platform employs robust security measures, including encryption, secure login, and data protection protocols to ensure the safety and privacy of user information."
            />
        </div>
      </div>
    </div>
  );
}

export default page;
