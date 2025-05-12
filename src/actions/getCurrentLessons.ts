"use server";

import { db } from "@/db";
import { courseTable, lessons as lessonsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type CourseRecord = {
  id: string;
  clerkId: string;
  courseName: string | null;
  unit: number | null;
  lesson: number | null;
  currency: number | null;
  createdAt: Date;
  updatedAt: Date;
  currentLesson: number | null;
  currentUnit: number | null;
};

export type LessonRecord = {
  id: string;
  courseName: string;
  unit: number;
  lesson: number;
  type: string;
  content: string;

};

export async function getCurrentLessons(
  clerkId: string
): Promise<{ course: CourseRecord; lessons: LessonRecord[] } | null> {
  // Query the courses table for records matching the clerkId.
  const courses = await db
    .select({
      id: courseTable.id,
      clerkId: courseTable.clerkId,
      courseName: courseTable.courseName,
      unit: courseTable.unit,
      lesson: courseTable.lesson,
      currentUnit: courseTable.currentUnit,
      currentLesson: courseTable.currentLesson,
      currency: courseTable.currency,
      createdAt: courseTable.createdAt,
      updatedAt: courseTable.updatedAt,
    })
    .from(courseTable)
    .where(eq(courseTable.clerkId, clerkId));

  const course = courses[0];
  if (!course) {
    return null;
  }

  // Use default values if unit or lesson is null.
  const currentUnit = course.currentUnit ?? 1;
const currentLesson = course.currentLesson ?? 1;

let localUnit = course.unit ?? 1;
let localLesson = course.lesson ?? 1;

if (
  (currentUnit === (course.unit ?? 1) && currentLesson < localLesson) ||
  (currentUnit < (course.unit ?? 1))
) {
  // Here we ensure that if the current values are null, they default to 1.
  localUnit = course.currentUnit ?? 1;
  localLesson = course.currentLesson ?? 1;
}


  // Query the lessons table filtered by current unit and lesson.
  const rawLessons = await db
    .select({
      id: lessonsTable.id,
      courseName: lessonsTable.courseName,
      unit: lessonsTable.unit,
      lesson: lessonsTable.lesson,
      type: lessonsTable.type,
      content: lessonsTable.content,
    })
    .from(lessonsTable)
    .where(
      and(
        eq(lessonsTable.unit, localUnit),
        eq(lessonsTable.lesson, localLesson)
      )
    );

  // Map raw lessons to match our LessonRecord type—assigning defaults for nullable fields.
  const lessons: LessonRecord[] = rawLessons.map((lesson) => ({
    id: lesson.id,
    courseName: lesson.courseName ?? "",
    unit: lesson.unit ?? 1,
    lesson: lesson.lesson ?? 1,
    type: lesson.type ?? "",
    content: lesson.content ?? "",
  }));

  return { course, lessons };
}
