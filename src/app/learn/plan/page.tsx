"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { courseRenderer, CourseRecord } from "@/actions/courseRenderer";
import { updateCurrentCourse } from "@/actions/updateCurrentCourse";

// Helper: Generate an array [1,2,...,n]
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export default function SpanishPlanPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [courseData, setCourseData] = useState<CourseRecord | null>(null);
  // expandedUnit: If a unit is clicked, it is stored here (number 1–10); otherwise null.
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------------
  // 1. Get the user's current course progress from the database.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/");
      return;
    }

    const fetchCourseData = async () => {
      const data = await courseRenderer(user.id);
      if (!data) {
        router.push("/");
        return;
      }
      setCourseData(data);
      setLoading(false);
    };

    fetchCourseData();
  }, [isLoaded, user, router]);

  if (loading || !courseData) {
    return <div className="text-white p-8">Loading course plan...</div>;
  }

  // ---------------------------------------------------------------------
  // Handler for when a lesson is clicked.
  // ---------------------------------------------------------------------
  const handleLessonClick = async (
    unitNumber: number,
    lessonNumber: number,
    lessonState: "done" | "current" | "pending"
  ) => {
    // If the lesson is pending (i.e. not unlocked) do nothing.
    if (lessonState === "pending") return;

    // If the clicked lesson is the current lesson, navigate directly.
    if (unitNumber === courseData.unit && lessonNumber === courseData.lesson) {
      router.push("/learn/spanish/teach");
      return;
    }

    // Otherwise, if it's a previously completed lesson, update the course progress first.
    if (lessonState === "done") {
      try {
        await updateCurrentCourse(user!.id, unitNumber, lessonNumber);
        // Optionally update the local course progress.
        setCourseData({ ...courseData, unit: unitNumber, lesson: lessonNumber });
        router.push("/learn/spanish/teach");
      } catch (error) {
        console.error("Error updating course progress:", error);
      }
    }
  };

  // ---------------------------------------------------------------------
  // 2. Render the course plan:
  //    - Display Units 1 through 10 (vertical list).
  //    - Expanding a unit reveals its 10 lessons.
  //    - Unit icons: Active (yellow) if unit is less than or equal to the current unit; otherwise, gray.
  //    - For lessons:
  //        • In units lower than the current unit, every lesson is considered completed ("done").
  //        • In the current unit, lessons less than the current lesson are "done",
  //          the current lesson is labeled "current",
  //          and lessons after the current one are "pending" (locked).
  //        • In future units, all lessons are "pending."
  //    - The lesson icon displays "Lesson X". If the lesson is locked, a small red message is shown.
  //    - Clicking on an unlocked lesson either navigates directly (if current)
  //      or updates the progress (if previously completed) before navigation.
  // ---------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[url('/darkback2.png')] bg-cover bg-center p-8 text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 style={{color: "#ffffff", textShadow: "0 2px 0 #fbdb2b"}} className="text-4xl font-bold text-white mb-2 font-deluxe uppercase">Spanish Course Plan</h1>
        <p style={{color: "#ffffff", textShadow: "0 1px 0 #fbdb2b"}} className="text-white font-refrigerator">
          Current Progress: Unit {courseData.unit} - Lesson {courseData.lesson}
        </p>
      </div>

      {/* Units List */}
      <div className={`max-w-xl mx-auto ${nunitoSans.className}`}>
        {range(10).map((unitNumber) => {
          // The unit is considered active if it is less than or equal to the current unit.
          const unitIsActive = unitNumber <= (courseData.unit || 1);

          return (
            <div key={unitNumber} className="mb-6">
              {/* Unit Icon */}
              <div
                className={`bg-[#fbdb2b] shadow-lg border-4 hover:bg-[#F3DF95] hover:cursor-pointer font-refrigerator w-75 h-21 flex items-center justify-center -skew-x-20 cursor-pointer mx-auto 
                  ${unitIsActive ? "bg-yellow-400" : "bg-gray-400"}`}
                onClick={() =>
                  setExpandedUnit(expandedUnit === unitNumber ? null : unitNumber)
                }
              >
                <span className="font-bold text-[#2a323f] skew-x-20">Unit {unitNumber}</span>
              </div>

              {/* If this unit is expanded, show its lessons */}
              {expandedUnit === unitNumber && (
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  {range(10).map((lessonNumber) => {
                    // Determine the lesson state:
                    // - If the unit is less than the current unit, all lessons are "done."
                    // - If the unit is equal to the current unit:
                    //      • lessons less than the current lesson: "done"
                    //      • lesson exactly equal: "current"
                    //      • lessons greater: "pending"
                    // - Future units: automatically "pending"
                    let lessonState: "done" | "current" | "pending" = "pending";
                    if (unitNumber < courseData.unit) {
                      lessonState = "done";
                    } else if (unitNumber === courseData.unit) {
                      if (lessonNumber < courseData.lesson) {
                        lessonState = "done";
                      } else if (lessonNumber === courseData.lesson) {
                        lessonState = "current";
                      }
                    }
                    // Choose background color based on lesson state.
                    let bgColor = "bg-gray-300"; // pending
                    if (lessonState === "done") {
                      bgColor = "bg-yellow-300";
                    } else if (lessonState === "current") {
                      bgColor = "bg-yellow-400 w-22 h-22 border-4 border-white";
                    }

                    return (
                      <div key={lessonNumber} className="flex flex-col items-center">
                        <div
                          onClick={() =>
                            handleLessonClick(unitNumber, lessonNumber, lessonState)
                          }
                          //className={`w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer ${bgColor}`}
                          className={`shadow-lg border-2 hover:bg-[#F3DF95] hover:cursor-pointer font-fridge w-20 rounded-full h-20 flex items-center justify-center cursor-pointer mx-auto ${bgColor}`}
                        >
                          <span>Lesson {lessonNumber}</span>
                        </div>
                        {lessonState === "pending" && (
                          <span className="font-fridge text-red-400 mt-1">LOCKED</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Optional Navigation Button */}
      <div className="mt-8 text-center">
        <Button size="lg" onClick={goCourses}>
          Back to Courses
        </Button>
      </div>
    </div>
  );
}
