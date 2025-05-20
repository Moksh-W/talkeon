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
        10% of all our profits will be donated to Sarcoma Foundation. That means for every subscription, we will be donating half a dollar a month to the Sarcoma Foundation.
        </p>
      </main>
      </div>
      
      
  )

  
}
  