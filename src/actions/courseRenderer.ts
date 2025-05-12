"use server";
import { courseTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

// Define and export the type
export type CourseRecord = {
  unit: number;
  lesson: number;
  courseName?: string;
};

export async function courseRenderer(clerkId: string): Promise<CourseRecord | null> {
  const result = await db
    .select({
      unit: courseTable.unit,
      lesson: courseTable.lesson,
      courseName: courseTable.courseName,
    })
    .from(courseTable)
    .where(eq(courseTable.clerkId, clerkId)) as CourseRecord[];

  return result[0] ?? null;
}
