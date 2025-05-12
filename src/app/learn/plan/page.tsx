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
    <div className="min-h-screen bg-[url('/back2.png')] bg-cover bg-center p-8 text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Spanish Course Plan</h1>
        <p className="text-white">
          Current Progress: Unit {courseData.unit}, Lesson {courseData.lesson}
        </p>
      </div>

      {/* Units List */}
      <div className="max-w-xl mx-auto">
        {range(10).map((unitNumber) => {
          // The unit is considered active if it is less than or equal to the current unit.
          const unitIsActive = unitNumber <= (courseData.unit || 1);

          return (
            <div key={unitNumber} className="mb-6">
              {/* Unit Icon */}
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full cursor-pointer mx-auto shadow-lg 
                  ${unitIsActive ? "bg-yellow-400" : "bg-gray-400"}`}
                onClick={() =>
                  setExpandedUnit(expandedUnit === unitNumber ? null : unitNumber)
                }
              >
                <span className="text-xl font-bold text-white">Unit {unitNumber}</span>
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
                      bgColor = "bg-yellow-400";
                    } else if (lessonState === "current") {
                      bgColor = "bg-yellow-500 border-4 border-white";
                    }

                    return (
                      <div key={lessonNumber} className="flex flex-col items-center">
                        <div
                          onClick={() =>
                            handleLessonClick(unitNumber, lessonNumber, lessonState)
                          }
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer ${bgColor}`}
                        >
                          <span>Lesson {lessonNumber}</span>
                        </div>
                        {lessonState === "pending" && (
                          <span className="text-xs text-red-600 mt-1">Not unlocked yet</span>
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
        <Link
          href="/learn/spanish"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Spanish Learning
        </Link>
      </div>
    </div>
  );
}
