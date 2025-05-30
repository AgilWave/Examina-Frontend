import React from "react";
import Button from "@/components/common/button";
import Link from "next/link";
import { MoveRight } from "lucide-react";

function Page() {
  return (
    <div
      className="
      flex 
      flex-col 
      items-center 
      justify-center 
      gap-8 
      md:gap-11 
      px-4 
      py-16 
      md:py-24 
      text-center
    "
    >
      <div
        className="
        w-full 
        flex 
        flex-col 
        justify-start 
        items-center 
        gap-10
      "
      >
        <div
          className="
          flex 
          flex-col 
          justify-start 
          items-center 
          gap-10 
        "
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-white text-center">
            Ready to Transform Your Exam Process?
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-normal text-center max-w-4xl mx-auto leading-relaxed">
            Sign up today and experience the future of online examinations with
            AI-driven security, ease of use, and robust exam management
            features.
          </p>
        </div>
      </div>

      <Link href="/login" passHref>
        <Button
          label="Get Started"
          className="
            h-15
            bg-black 
            border-teal-500 
            text-teal-300
            w-full 
            max-w-xs 
            md:w-auto 
            md:max-w-none
          "
          icon={<MoveRight size={24} strokeWidth={2} />}
          iconPosition="right"
        />
      </Link>
    </div>
  );
}

export default Page;
