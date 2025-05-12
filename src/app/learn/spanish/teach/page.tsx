"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getCurrentLessons, LessonRecord } from "@/actions/getCurrentLessons";
import { Nunito_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { isInSpanish } from "@/actions/isInCourse";
import { courseRenderer, CourseRecord } from "@/actions/courseRenderer";
import { updateCourseProgress } from "@/actions/updateCourseProgress";
import { updateCurrentCourse } from "@/actions/updateCurrentCourse";
import { getCurrentCourseProgress } from "@/actions/getCurrentCourseProgress"; // new server action

const nunitoSans = Nunito_Sans({ subsets: ['latin'] });

// A simple FlashCard component for vocabulary lessons.
function FlashCard({ spanish, english }: { spanish: string; english: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped((prev) => !prev)}
      className="cursor-pointer p-4 border rounded shadow-md w-40 h-24 flex items-center justify-center text-center transition-transform duration-300 hover:scale-105"
    >
      {flipped ? english : spanish}
    </div>
  );
}

export default function SpanishTeachPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/");
      return;
    }

    async function fetchData() {
      // Get course record and associated lessons.
      const result = await getCurrentLessons(user!.id);
      if (!result) {
        router.push("/");
        return;
      }

      // Get stored progress from the database using our new server action.
      const storedProgress = await getCurrentCourseProgress(user!.id);

      // "Ongoing" progress from the course record.
      const ongoingUnit = result.course.unit ?? 1;
      const ongoingLesson = result.course.lesson ?? 1;

      // Choose local progress. If the stored progress is behind the course progress,
      // then use the stored lesson value.
      let localUnit = ongoingUnit;
      let localLesson = ongoingLesson;
      if (
        (storedProgress.currentUnit === ongoingUnit && storedProgress.currentLesson < ongoingLesson) ||
        (storedProgress.currentUnit < ongoingUnit)
      ) {
        localUnit = storedProgress.currentUnit;
        localLesson = storedProgress.currentLesson;
      }
      

      // Overwrite the course progress with our computed "local" values.
      const updatedCourse = {
        ...result.course,
        unit: localUnit,
        lesson: localLesson,
      };

      setCourse(updatedCourse);
      setLessons(result.lessons);
      setLoading(false);
    }
    fetchData();
  }, [user, isLoaded, router]);

  if (loading) {
    return <div className="text-white p-8">Loading Course...</div>;
  }

  // Use the (possibly overridden) progress values for the header.
  const ongoingUnit = course.unit ?? 1;
  const ongoingLesson = course.lesson ?? 1;

  return (
    <div className="min-h-screen bg-[url('/darkback2.png')] bg-cover bg-center p-8 flex flex-col items-center">
      <header className="flex items-center gap-4 text-center mb-6">
        <Image src="/es.png" alt="Spanish Icon" width={50} height={50} className="rounded-full" />
        <h1
          className="text-4xl font-bold text-white uppercase font-deluxe"
          style={{ textShadow: "0 2px 0 #fbdb2b" }}
        >
          {course.courseName || "Spanish Course"} – Unit {ongoingUnit} - Lesson {ongoingLesson} Learn
        </h1>
      </header>
      <main className="max-w-3xl mx-auto space-y-8">
        {lessons.map((lesson) => {
          const lessonType = lesson.type.toLowerCase();
          // Render non-vocabulary lessons directly.
          if (
            lessonType === "grammar" ||
            lessonType === "speaking" ||
            lessonType === "reading" ||
            lessonType === "writing" ||
            lessonType === "listening"
          ) {
            return (
              <div key={lesson.id} className="bg-white p-6 rounded shadow mb-4 font-deluxe">
                <h2 className="mb-2 uppercase">{lesson.type}</h2>
                <div className={`text-gray-800 text-[1.5rem] ${nunitoSans.className}`}>
                  {lesson.content.split("\\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          }

          // For vocabulary lessons, split the content into flashcards.
          if (lessonType === "vocabulary") {
            const parts = lesson.content.split("|").map((str) => str.trim());
            const flashCards = [];
            for (let i = 0; i < parts.length; i += 2) {
              const spanish = parts[i];
              const english = parts[i + 1] || "";
              flashCards.push(<FlashCard key={i} spanish={spanish} english={english} />);
            }
            return (
              <div key={lesson.id} className="bg-white p-6 rounded shadow mb-4">
                <h2 className="text-2xl font-semibold mb-2 capitalize">Vocabulary</h2>
                <div className="flex flex-wrap gap-4">{flashCards}</div>
              </div>
            );
          }

          // Fallback for any other lesson type.
          return (
            <div key={lesson.id} className="bg-white p-6 rounded shadow mb-4"></div>
          );
        })}
      </main>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <Button
          onClick={async () => {
            // When "Back" is clicked, update the currentCourse record in the database
            // to set currentUnit and currentLesson to 10, then navigate.
            await updateCurrentCourse(user!.id, 10, 10);
            router.push("/");
          }}
        >
          Back
        </Button>
        <Button onClick={() => router.push("/learn/spanish/practice")}>
          To Practice!
        </Button>
      </div>
    </div>
  );
}
