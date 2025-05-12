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
        </span>{" "}
        <span style={{ color: "#fbdb2b"}}>
          TALKEON
        </span>
      </h1>

    </div>
      <main className="max-w-3xl text-center space-y-6 font-stretch-50% py-8 text-[1.2rem]">
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          We are a group of soon-to-be high schoolers united by our passion for
          language learning. We noticed that many of our peers used apps like
          Duolingo only to farm streaks.
        </p>
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          One of our founders, Vihaan Vartak is fluent in 3 languages: English, Hindi and Marathi. He personallhy dislikes the streak culture of duolingo 
          as people just do it for the streak and not to learn. It throws you in without a way out. This ideology can be reflected in Talkeon where there are 
          lessons then practice.
        </p>
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          Another of our founders, Moksh Wadhwani, speaks six languages fluently,
          including French, Spanish, Mandarin, and Hindi, some of the courses we will now
          soon be offering on Talkeon.
        </p>
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          Another person crucial to this platform is Howard Yao, is a native Mandarin
          speaker who is currently on his journey to master Arabic. Our basic Mandarin course would not have been possible without him.
        </p>
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          Finally come Aarav Kumar, and Clara Shim. They helped to design our website, coming up with a sleek and modern UI design.
        </p>
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          Without these people, Talkeon would not have been possible.
        </p>
      </main>
    </div>
  );
}

  