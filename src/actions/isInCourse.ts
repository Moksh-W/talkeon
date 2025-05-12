"use server"
import { db } from "@/db";
import { courseTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function isInSpanish(clerkId: string){
    try{
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
        return true; // Already registered
      }
      else{
        return false
      }
    }

    catch(error: any){
        throw new error;
    }
}
