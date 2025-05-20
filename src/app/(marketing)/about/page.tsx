/*"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
export default function Home() {
  return (
    <div className="bg-[url('/back2.png')] bg-cover bg-center h-screen flex flex-col justify-center items-center gap-6">
      
      <div className="relative flex flex-col items-center justify-center p-10 bg-[url('/back.png')] bg-repeat-x bg-contain bg-center w-full">
        <img src="/talkeon.png" className="w-96 h-auto" alt="Talkeon Logo" />
        <p className="font-refrigerator text-[#fbdb2b]">SPEAK. CONNECT. GROW.</p>
      </div>
  
      <div className="flex gap-4">
        <Button size="lg">Lol</Button> 
        <Button size="lg">Back</Button> 
      </div>
  
    </div>
  )
}*/

"use client";

import Image from "next/image";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
});

export default function AboutPage() {
  return (
    <div className={`bg-[url('/darkback2.png')] bg-center min-h-screen flex flex-col items-center py-8 ${nunitoSans.className}`}>
      <div className="relative flex flex-col items-center justify-center p-10 bg-[url('/back.png')] bg-repeat-x bg-auto bg-left w-full">
      <h1 className="font-deluxe text-4xl">
        <span style={{ color: "#ffffff", textShadow: "0 2px 0 #11e4e7" }}>
          ABOUT
        </span>
        
      </h1>
      

    </div>
      <main className="max-w-3xl text-center space-y-6 font-stretch-50% py-8 text-[1.2rem]">
      <center></center>
        <p>[Insert picture here]</p>
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          Talkeon is a language learning app which focuses on practicality and learnability. Unlike many other language learning apps out there, our lesson-practice format is designed to be effective while easy for the user.
        </p>
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          
        </p>
      </main>
    </div>
  );
}

  