// actions/getUserCourses.ts
"use server";
import { courseTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { CourseRecord } from "@/actions/courseRenderer"; // Ensure CourseRecord is exported correctly

export async function getUserCourses(clerkId: string): Promise<CourseRecord[]> {
  const result = await db
    .select({
      id: courseTable.id,
      clerkId: courseTable.clerkId,
      courseName: courseTable.courseName,
      unit: courseTable.unit,
      lesson: courseTable.lesson,
    })
    .from(courseTable)
    .where(eq(courseTable.clerkId, clerkId));
      
  return result as CourseRecord[];
}
