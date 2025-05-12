// File: src/app/page.tsx or another server file
'use server';

import { db } from "@/db";
import { courseTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Registers a user for the Spanish course if not already registered.
 * 
 * @param clerkId - The authenticated user's Clerk ID
 * @returns 1 if registration succeeded, 0 if already registered, -1 on error
 */
export async function registerSpanish(clerkId: string): Promise<number> {
  try {
    const existingRegistration = await db
      .select()
      .from(courseTable)
      .where(
        and(
          eq(courseTable.clerkId, clerkId),
          eq(courseTable.courseName, "Spanish")
        )
      )
      .limit(1);

    if (existingRegistration.length > 0) {
      return 0; // Already registered
    }

    await db.insert(courseTable).values({
      clerkId,
      courseName: "Spanish",
      lesson: 1,
      unit: 1
    });
    return 1; // Successfully registered
   
  } catch (error) {
    console.error("Failed to register for Spanish course:", error);
    return -1; // Error occurred
  }
}
