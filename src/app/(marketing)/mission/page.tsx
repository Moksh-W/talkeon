"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
});
export default function MissionPage() {
  return (
    <div className={`bg-[url('/darkback2.png')] bg-center min-h-screen flex flex-col items-center py-8 ${nunitoSans.className}`}>
      <div className="relative flex flex-col items-center justify-center p-10 bg-[url('/back.png')] bg-repeat-x bg-auto bg-left w-full">
      <h1 className="font-deluxe text-[#ffffff] text-4xl" style={{ textShadow: "0 2px 0 #11e4e7" }}>
        OUR MISSION
      </h1>
      </div>
      <main className="max-w-3xl text-center space-y-6 text-[1.2rem] py-8">
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
        Learning a new language is becoming increasingly more important as travel booms and the world gets closer and better connected via the Internet. Being bilingual or multilingual is an extremely beneficial and highly valued skill in this era. When we realized that current language learning apps just weren’t cutting it, we decided to take the problem into our own hands.
        </p>
      </main>
      <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b", fontSize: 24}}><b>Benefits of learning a language:</b></p>
      <ol>
          <li className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>- Job opportunities in other countries</li>
          <li className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>- Better understand the other cultures</li>
          <li className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>- Get around better as a tourist</li>
          <li className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>- Connect with global communities</li>
        </ol>
      <main className="max-w-3xl text-center space-y-6 text-[1.2rem] py-8">
        <p className="text-white" style={{ textShadow: "0.9px 0 0 #fbdb2b" }}>
          With Talkeon, our goal is to create a platform that <b><i>ACTUALLY</i></b> helps you learn a language. It is fully customizable, and it lets you learn your way. To advance to the next part of the course, you can earn points by practicing in five different skill trees: grammar, speaking, reading, writing, and listening.
        </p>
      </main>
      
    </div>
  );
}
  