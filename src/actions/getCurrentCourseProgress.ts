// File: /actions/getCurrentCourseProgress.ts
"use server";

import { courseTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function getCurrentCourseProgress(clerkId: string): Promise<{ currentUnit: number; currentLesson: number }> {
  const result = await db
    .select()
    .from(courseTable)
    .where(eq(courseTable.clerkId, clerkId));
    return {
      currentUnit: result[0].currentUnit ?? 1,
      currentLesson: result[0].currentLesson ?? 1,
    }
  }
