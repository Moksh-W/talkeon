"use server";
import { questions } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";

export async function renderer(lesson: number, unit: number, index: number) {
  const result = await db
    .select({
      question: questions.question,
      type: questions.type,
      answers: questions.answer,
      section: questions.section
    })
    .from(questions)
    .where(
      and(
        eq(questions.questionIdx, index),
        eq(questions.lesson, lesson),
        eq(questions.unit, unit)
      )
    );

  const data = result[0];
  if (!data) {
    return null
  }

  const { question, type, answers, section } = data;
  if (type === "Definition") {
    
    return {
      question,
      answers,
      section,
      type
      
    };

  }

  if (type === "Multiple Choice") {
    const parts = answers?.split("|").map(p => p.trim());
  
    const correctPart = parts?.find(p => p.startsWith("Correct:"));
    const correctAnswer = correctPart?.split("Correct:")[1].trim();
  
    const answer = parts?.filter(p => !p.startsWith("Correct:"));
    
   
    return {
      question, 
      answer,
      correctAnswer,
      section
    };
  }
  

  // Handle other types if needed
 
}
