"use client"
import { Button } from "@/components/ui/button";
import { registerSpanish } from "@/actions/registerCourse";
import {useState} from "react"
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { renderer } from "@/actions/questionRenderer";
export default function Home() {
  const [users, setUsers] = useState("")

  const router = useRouter()
  const { user } = useUser(); // get logged-in user

  async function registerCourse() {
    if (!user) {
      setUsers("User not logged in")
      return;
    }
  

    const clerkId = user.id;
    const courseName = "Spanish";

    try {
      const res = await registerSpanish(clerkId);
     
    } catch (err) {
      console.error("Failed to register course:", err);
    }
  }

  async function goTospanish(){
    if (!user) {
      setUsers("User not logged in")
      return;
    }
    router.push('/learn/spanish/practice')
  }

  async function click(){
    renderer(1, 1, 2)
  }
  return (
    <div className="bg-[url('/back2.png')] bg-cover bg-center h-screen flex flex-col justify-center items-center gap-6">
      
      {/* Wrapper for Logo and Text with Background Image */}
      <div className="relative flex flex-col items-center justify-center p-10 bg-[url('/back.png')] bg-repeat-x bg-contain bg-center w-full">
        <img src="/talkeon.png" className="w-96 h-auto" alt="Talkeon Logo" />
        <p className="font-refrigerator text-[#fbdb2b]">SPEAK. CONNECT. GROW.</p>
      </div>

      
  
      {/* Buttons below the image, side by side */}
      <div className="flex gap-4">
        <Button size="lg" onClick={registerCourse}>Register Course</Button>
      </div>
      <p> {users} </p>
  
    </div>
  )

  
}
  