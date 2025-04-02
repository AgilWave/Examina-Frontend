"use client";
import React from "react";
import Image from "next/image";
import miniLogo from "@/public/imgs/loginlogo.png";
import logo from "@/public/imgs/university.png";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { decrypt } from "@/lib/encryption";
import axios from "axios";

function ChangePassword() {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const userDetails = Cookies.get("userDetails");
  const decryptedString = userDetails ? decrypt(userDetails) : null;
  const decryptedDetails = decryptedString ? JSON.parse(decryptedString) : null;
  const name = decryptedDetails?.name || "User";
  const id = decryptedDetails?.id || "User";

  const jwt = Cookies.get("adminjwt");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setTimeout(() => {
        setErrors({ password: "Passwords do not match." });
      }, 1000);
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/Interact/UpdatePassword/${id}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.data.isSuccessful) {
        toast.success(
          response.data.message || "Password changed successfully!"
        );
        router.push("/admin/login");
      } else {
        toast.error(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing the password.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-teal-900 relative overflow-hidden p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-80 h-80 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] 
          bg-cyan-400/50 rounded-full blur-[180px] md:blur-[250px] 
          -top-1/3 -left-1/3 transform -translate-x-1/2 -translate-y-1/2"
        />
        <div
          className="absolute w-80 h-80 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] 
          bg-teal-300/40 rounded-full blur-[180px] md:blur-[250px] 
          -bottom-1/3 -right-1/3 transform translate-x-1/2 translate-y-1/2"
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-8">
        <div
          className="bg-white/90 p-6 md:p-8 rounded-[40px] shadow-2xl w-full max-w-md mx-auto
          transition-all duration-300 hover:shadow-xl border border-white/20"
        >
          <div className="flex justify-center mb-6 w-full">
            <div className="relative ml-10 w-40 h-20 md:w-48 md:h-24">
              <Image
                src={logo}
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
            {`Hello ${name.split(" ")[0]}!`}
          </h1>

          <p className="text-center text-gray-600 mb-8 text-sm md:text-base">
            Before you can access your account, please enter your new password.
            <br />
            If you have any issues, please contact support.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="New Password"
                required
                className="w-full text-black bg-white px-4 py-3 border border-gray-300 rounded-2xl 
    focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent
    transition-all duration-200
    [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-black
    [&:-webkit-autofill:hover]:bg-white [&:-webkit-autofill:focus]:bg-white
    [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]
    [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(0,0,0)]"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                required
                className="w-full text-black bg-white px-4 py-3 border border-gray-300 rounded-2xl 
                focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent
                transition-all duration-200
                [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-black
                [&:-webkit-autofill:hover]:bg-white [&:-webkit-autofill:focus]:bg-white
                [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]
                [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(0,0,0)]"
              />
            </div>
            <div className="text-red-500 text-sm text-center">
              {errors.password && <p>{errors.password}</p>}
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 
              bg-gradient-to-tl from-teal-600 to-black
              text-white font-semibold 
              hover:from-teal-900 hover:to-cyan-900 
              transition-all duration-300 
              transform hover:scale-105 rounded-full 
              shadow-lg hover:shadow-xl"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <Image
          src={miniLogo}
          width={40}
          height={40}
          className="w-8 h-8 md:w-10 md:h-10 opacity-80 hover:opacity-100 transition-opacity"
          alt="Attendia Logo"
          priority
        />
      </div>

      <div className="absolute bottom-4 w-full text-center text-white/75 text-xs md:text-sm font-light z-30">
        © {new Date().getFullYear()} Attendia. All rights reserved.
      </div>
    </div>
  );
}

export default ChangePassword;
