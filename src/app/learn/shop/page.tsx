'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isInSpanish } from '@/actions/isInCourse';
import { useUser } from "@clerk/nextjs";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
});

export default function SpanishLearn() {
  const router = useRouter();
  const { user } = useUser(); // Use useUser() as a regular hook, no need for 'await'

  useEffect(() => {
    if (user) {

    const checkEnrollment = async () => {
      const enrolled = await isInSpanish(user.id);
      if (!enrolled) {
        router.push('/');  // Redirect to home if not enrolled
      }
    };

    checkEnrollment();

    }
    else{
        console.log(user)
    }
  }, [user, router]);  // Re-run when user or router changes

  return (
    <div className={`bg-[url('/darkback2.png')] bg-center min-h-screen flex flex-col items-center py-8 ${nunitoSans.className}`}>
      <div className="relative flex flex-col items-center justify-center p-10 bg-[url('/back.png')] bg-repeat-x bg-auto bg-left w-full">
      <h1 className="font-deluxe text-[#ffffff] text-4xl" style={{ textShadow: "0 2px 0 #fbdb2b" }}>
        SHOP
      </h1>
      </div>
      <div className="relative flex flex-col items-center h-20 justify-center m-6 bg-[url('/back.png')] bg-repeat-x bg-auto bg-left w-full">
      <h1 className="font-deluxe text-[#ffffff] text-4xl" style={{ textShadow: "0 2px 0 #fbdb2b" }}>
        SUBSCRIPTIONS
      </h1>
      </div>

      <div className={`"className=relative flex flex-col items-center justify-center rounded-2xl py-8 border-8 p-10 bg-[url('/back.png')] bg-repeat-x bg-auto bg-left w-[48rem] text-white ${nunitoSans.className}`}>
      <h1 className='font-refrig' style={{ textShadow: "0 2px 0 #fbdb2b" }}> Basic Subscription + Offered Courses</h1> 
      <p style={{ textShadow: "0 0.9px 0 #fbdb2b" }}> for</p>
      <p className="font-refrig" style={{ textShadow: "0 2px 0 #fbdb2b" }}> $4.99/month</p>
      <p> Benifits of the tier: </p>
      <ul> 
        <li> - AI conversations</li> 
        <li> - Speech Recognition </li>
        
      </ul>



      
      </div>
      <div className="className=relative flex flex-col items-center justify-center rounded-2xl py-8 border-8 p-10 bg-[url('/back.png')] bg-repeat-x bg-auto bg-left w-[48rem]">
      <h1 className="">NEW: CUSTOM SKIN SLOTS!</h1> 

      <p> Silver Chain: 200</p>
      <p> Golden Chain: 400 </p>

      
      </div>

      <div className="className=relative flex flex-col items-center justify-center rounded-2xl py-8 border-8 p-10 bg-[url('/back.png')] bg-repeat-x bg-auto bg-left w-[48rem]">
      <h1>NEW: CUSTOM SKIN SLOTS!</h1> 

      <p> Silver Chain: 200</p>
      <p> Golden Chain: 400 </p>

      
      </div>

    </div>
  );
}
