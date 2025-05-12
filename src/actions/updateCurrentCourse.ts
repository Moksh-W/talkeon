"use server";
import { courseTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

// Update the course record for the given Clerk ID.
export async function updateCurrentCourse(
  clerkId: string,
  newUnit: number,
  newLesson: number
): Promise<boolean> {
  await db
    .update(courseTable)
    .set({ currentUnit: newUnit, currentLesson: newLesson })
    .where(eq(courseTable.clerkId, clerkId));
  return true;
}
