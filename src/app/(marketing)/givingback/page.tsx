"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
});
export default function Home() {

  return (
    <div className={`bg-[url('/darkback2.png')] bg-center min-h-screen flex flex-col items-center py-8 ${nunitoSans.className}`}>
      
      {/* Wrapper for Logo and Text with Background Image */}
      <div className="relative flex flex-col items-center justify-center p-10 bg-[url('/back.png')] bg-repeat-x bg-contain bg-center w-full">
      <h1 className="font-deluxe text-[#ffffff] text-4xl" style={{ textShadow: "0 2px 0 #ef2cff" }}>
        GIVING BACK
      </h1>
      </div>
      <main className="max-w-3xl text-center space-y-6 text-[1.2rem] py-8">
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
        How do we give back?
        </p>
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          With Talkeon, our goal is to create a platform that <b><i>ACTUALLY</i></b> helps you learn a language. It is fully customizable, and it lets you learn your way. To advance to the next part of the course, you can earn points by practicing in five different skill trees: grammar, speaking, reading, writing, and listening. We have tried our best to make the process of mastering a new language easy.
        </p>
      </main>
      </div>
      
      
  )

  
}
  