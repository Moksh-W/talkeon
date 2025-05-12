"use server";

import { db } from "@/db";
import { courseTable, questions as questionTable } from "@/db/schema";
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

export type QuestionRecord = {
  id: string;
  courseName: string;
  unit: number;
  lesson: number;
  type: string;
  question: string;
  answer: string;
  section: string;
  questionIdx: number;

};

/*export async function getQuestionsForCourse(unit: number, lesson: number) {
  const result = await db
    .select({
      question: questions.question,
      type: questions.type,
      answer: questions.answer, // For Multiple Choice or Definition.
      section: questions.section,
      questionIdx: questions.questionIdx,
    })
    .from(questions)
    .where(
      and(
        eq(questions.unit, unit),
        eq(questions.lesson, lesson)
      )
    )
    .orderBy(questions.questionIdx);
  return result;
}*/

export async function getQuestionsForCourse(
  clerkId: string
): Promise<{ course: CourseRecord; questions: QuestionRecord[] } | null> {
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
  const rawQuestions = await db
    .select({
      id: questionTable.id,
      courseName: questionTable.courseName,
      unit: questionTable.unit,
      lesson: questionTable.lesson,
      type: questionTable.type,
      question: questionTable.question,
      answer: questionTable.answer,
      section: questionTable.section,
      questionIdx: questionTable.questionIdx
    })
    .from(questionTable)
    .where(
      and(
        eq(questionTable.unit, localUnit),
        eq(questionTable.lesson, localLesson)
      )
    );

  // Map raw lessons to match our LessonRecord type—assigning defaults for nullable fields.
  const questions: QuestionRecord[] = rawQuestions.map((questions) => ({
    id: questions.id,
    courseName: questions.courseName ?? "",
    unit: questions.unit ?? 1,
    lesson: questions.lesson ?? 1,
    type: questions.type ?? "",
    question: questions.question ?? "",
    answer: questions.answer ?? "",
    section: questions.section ?? "",
    questionIdx: questions.questionIdx ?? 1,
  }));

  return { course, questions };
}
