"use server";
import { courseTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

// Update the course record for the given Clerk ID.
export async function updateCourseProgress(
  clerkId: string,
  newUnit: number,
  newLesson: number
): Promise<boolean> {
  await db
    .update(courseTable)
    .set({ unit: newUnit, lesson: newLesson })
    .where(eq(courseTable.clerkId, clerkId));
  return true;
}
