'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isInSpanish } from '@/actions/isInCourse';
import { useUser } from "@clerk/nextjs";
import { Nunito_Sans } from "next/font/google";
import Image from 'next/image';
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
});

export default function SpanishLearn() {
  const router = useRouter();
  const { user } = useUser(); // Use useUser() as a regular hook, no need for 'await'

  const [enrolledSpanish, setSpan] = useState<null | boolean>(null);

  useEffect(() => {
    if (user) {

    const checkEnrollment = async () => {
      const enrolled = await isInSpanish(user.id);
      if (!enrolled) {
        setSpan(false);
      }
      else{
        setSpan(true)
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
        COURSES
      </h1>
      </div>
      {/* Course content goes here */}
      
      {enrolledSpanish === null ? (
        <h1 className="py-8 text-white">Loading...</h1>
      ) : enrolledSpanish === false ? (
        <h1 className="py-8 text-white">You are not enrolled in any courses.</h1>
      ) : (
        <a href="/learn/plan" className="max-w-md w-full py-8">
          <div className="bg-black/70 p-4 rounded-2xl shadow-xl flex items-center gap-4 hover:bg-black/80 transition-colors cursor-pointer">
            {/* Spanish icon */}
            <Image
              src="/es.png"
              alt="Spanish Icon"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h2
                className="font-deluxe text-2xl text-white"
                style={{ textShadow: "0 1px 0 #fbdb2b" }}
              >
                Spanish Course
              </h2>
              <p className="text-gray-300 text-sm">Start Learning</p>
            </div>
          </div>
        </a>
      )}
    </div>
  );
}
