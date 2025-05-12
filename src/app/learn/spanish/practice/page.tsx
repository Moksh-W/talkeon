'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isInSpanish } from '@/actions/isInCourse';
import { courseRenderer, CourseRecord } from '@/actions/courseRenderer';
import { getQuestionsForCourse } from '@/actions/getQuestionsForCourse';
import { updateCourseProgress } from '@/actions/updateCourseProgress';
import { useUser } from "@clerk/nextjs";
import { Nunito_Sans } from 'next/font/google';
import { Button } from "@/components/ui/button";
import { updateCurrentCourse } from "@/actions/updateCurrentCourse";
import { getCurrentCourseProgress } from "@/actions/getCurrentCourseProgress"; // new server action

const nunitoSans = Nunito_Sans({ subsets: ['latin'] });

export default function SpanishLearn() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  async function goToPlan(){
    router.push('/learn/plan')
  }

  // ----------------------------------------------------------------
  // State variables
  // ----------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<CourseRecord | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [unitLol, setUnitLol] = useState<number | null>(null);
  const [lessonLol, setLessonLol] = useState<number | null>(null);
  const [increaseProgress, setIncreaseProgress] = useState<number | null>(null);

  // Lesson sections.
  const sections = ['Warm Up', 'Lesson', 'Review'] as const;
  type SectionType = typeof sections[number];

  // Current section and question index.
  const [currentSection, setCurrentSection] = useState<SectionType>('Warm Up');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // User input.
  const [inputAnswer, setInputAnswer] = useState('');

  // Progress state per section.
  const [sectionProgress, setSectionProgress] = useState<Record<SectionType, number>>({
    'Warm Up': 0,
    'Lesson': 0,
    'Review': 0,
  });

  // Feedback: "correct", "wrong", or "".
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "">("");

  // Overlay state: "" = normal, "transition" = between sections, "completion" = final lesson complete.
  const [transitionOverlay, setTransitionOverlay] = useState<"transition" | "completion" | "">("");

  // ----------------------------------------------------------------
  // 1. Load Course Record and Questions from Database
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/');
      return;
    }

    const initCourse = async () => {
      const courseRecord = (await courseRenderer(user.id)) as CourseRecord | null;
      if (!courseRecord) {
        router.push('/');
        return;
      }
      setCourseData(courseRecord);
      

      const enrolled = await isInSpanish(user.id);
      if (!enrolled) {
        router.push('/');
        return;
      }

      const result = await getCurrentCourseProgress(user!.id);
      if (!result) {
        router.push("/");
        return;
      }
    
      setUnitLol(courseRecord!.unit)
      setLessonLol(courseRecord!.lesson)     
      setIncreaseProgress(1)
      if ((result.currentUnit === courseRecord!.unit && result.currentLesson < courseRecord!.lesson) || (result.currentUnit < courseRecord!.unit)) {
          setIncreaseProgress(0)
          setUnitLol(result.currentUnit)
          setLessonLol(result.currentLesson)
          
      }

      // Retrieve the full relult from getQuestionsForCourse.
      const relult = await getQuestionsForCourse(user!.id);
      if (relult) {
        // Extract the questions array and process it.
        const retrievedQuestions = relult.questions.map((q: any) => {
          if (q.type === "Multiple Choice" && q.answer) {
            const parts = q.answer.split("|").map((p: string) => p.trim());
            const correctPart = parts.find((p: string) => p.startsWith("Correct:"));
            let correctAnswer = correctPart ? correctPart.split("Correct:")[1].trim() : "";
            // Strip out the option letter (e.g. "C. Hello" becomes "Hello")
            if (correctAnswer.includes(".")) {
              correctAnswer = correctAnswer.substring(correctAnswer.indexOf(".") + 1).trim();
            }
            return { ...q, correctAnswer };
          }
          return q;
        });
        setQuestions(retrievedQuestions);
      }
      setLoading(false);
    };

    initCourse();
  }, [isLoaded, user, router]);

  const filteredQuestions = useMemo(() => {
    if (!courseData) return { warmUp: [], lesson: [], review: [] };
    const warmUp = questions.filter((q) => q.section === 'Warm Up');
    const lessonQ = questions.filter((q) => q.section === 'Lesson');
    const review = questions.filter((q) => q.section === 'Review');
    return { warmUp, lesson: lessonQ, review };
  }, [questions, courseData]);

  const totalQuestionsForCurrentSection = useMemo(() => {
    if (currentSection === 'Warm Up') return filteredQuestions.warmUp.length;
    if (currentSection === 'Lesson') return filteredQuestions.lesson.length;
    if (currentSection === 'Review') return filteredQuestions.review.length;
    return 0;
  }, [currentSection, filteredQuestions]);

  const currentQuestion = useMemo(() => {
    let sectionArray: any[] = [];
    if (currentSection === 'Warm Up') sectionArray = filteredQuestions.warmUp;
    else if (currentSection === 'Lesson') sectionArray = filteredQuestions.lesson;
    else if (currentSection === 'Review') sectionArray = filteredQuestions.review;
    return sectionArray[currentQuestionIndex];
  }, [currentSection, currentQuestionIndex, filteredQuestions]);

  // ----------------------------------------------------------------
  // Answer Submission Handler
  // ----------------------------------------------------------------
  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    let isCorrect = false;
    if (currentQuestion.type === 'Definition') {
      if (inputAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()) {
        isCorrect = true;
      }
    } else if (currentQuestion.type === 'Multiple Choice') {
      if (inputAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      setSectionProgress(prev => ({
        ...prev,
        [currentSection]: prev[currentSection] + 1,
      }));
      setFeedback("correct");
      if (currentQuestionIndex < totalQuestionsForCurrentSection - 1) {
        setTimeout(() => {
          setFeedback("");
          setCurrentQuestionIndex(prev => prev + 1);
        }, 1500);
      } else {
        setTimeout(async () => {
          setFeedback("");
          if (currentSection === 'Review') {
            if (increaseProgress === 1) {
            const ongoingLesson = courseData!.lesson || 1;
            const ongoingUnit = courseData!.unit || 1;
            let newLesson = ongoingLesson + 1;
            let newUnit = ongoingUnit;
            if (newLesson >= 10) {
              newLesson = 1;
              newUnit = ongoingUnit + 1;
            }
            try {
              await updateCourseProgress(user!.id, newUnit, newLesson);
              console.log("Course progress updated");
            } catch (err) {
              console.error("Error updating progress:", err);
            }
            setTransitionOverlay("completion");
          }
          else {
            setTimeout(()=>{
              setTransitionOverlay("completion");
            })
            await updateCurrentCourse(user!.id, 10, 10);
          }
        
        } else {
            setTransitionOverlay("transition");
            setTimeout(() => {
              setTransitionOverlay("");
              setCurrentSection(currentSection === 'Warm Up' ? 'Lesson' : 'Review');
              setCurrentQuestionIndex(0);
            }, 2000);
          }
        }, 3000);
      }
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(""), 1500);
    }
    setInputAnswer('');
  };

  const parseMultipleChoice = (answerString: string) => {
    const parts = answerString.split("|").map(p => p.trim());
    let options: string[] = [];
    let correctOption = "";
    parts.forEach(part => {
      if (part.startsWith("Correct:")) {
        correctOption = part.replace("Correct:", "").trim();
        if (correctOption.includes(".")) {
          correctOption = correctOption.substring(correctOption.indexOf(".") + 1).trim();
        }
      } else {
        const dotIndex = part.indexOf(".");
        if (dotIndex !== -1) {
          options.push(part.substring(dotIndex + 1).trim());
        } else {
          options.push(part);
        }
      }
    });
    return { options, correctOption };
  };

  if (!isLoaded || loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className={`relative bg-[url('/darkback2.png')] bg-cover bg-center min-h-screen p-8 ${nunitoSans.className} flex flex-col items-center`}>
      {/* --- Centered Progress Bar --- */}
      <div className="w-full max-w-4xl mb-6 mx-auto">
        <div className="flex justify-between text-white mb-2">
          {sections.map(section => (
            <span key={section} className="flex-1 text-center font-refrigerator uppercase" style={{ textShadow: '0 1px 0 #fbdb2b' }}>
              {section}
            </span>
          ))}
        </div>
        <div className="flex h-4">
          {sections.map(section => {
            let total = 0;
            if (section === 'Warm Up') total = filteredQuestions.warmUp.length;
            else if (section === 'Lesson') total = filteredQuestions.lesson.length;
            else if (section === 'Review') total = filteredQuestions.review.length;
            const progress = sectionProgress[section];
            const widthPercent = total > 0 ? (progress / total) * 100 : 0;
            return (
              <div key={section} className="flex-1 bg-gray-500 mx-1 rounded-full relative h-4">
                <div className="bg-[#fbdb2b] h-full rounded-full" style={{ width: `${widthPercent}%` }}></div>
                {section === currentSection && widthPercent > 0 && (
                  <Image 
                    src="/arrow.png" 
                    alt="progress arrow" 
                    width={37} 
                    height={37} 
                    style={{ left: `${widthPercent}%` }}
                    className="absolute bottom-[-1.2px] transform -translate-x-105/128" 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Course Header --- */}
      <div className="flex items-center gap-4 mb-6">
        <Image src="/es.png" alt="Spanish Icon" width={50} height={50} className="rounded-full" />
        <h1 className="text-3xl font-deluxe text-white" style={{ textShadow: '0 2px 0 #fbdb2b' }}>
          {`SPANISH - UNIT ${unitLol} - LESSON ${lessonLol} PRACTICE`}
        </h1>
      </div>

      {/* --- Full-Width, Centered Q/A Box --- */}
      <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg mb-4">
        {currentQuestion ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{currentQuestion.question}</h2>
            {currentQuestion.type === 'Definition' ? (
              <input
                type="text"
                placeholder="Type your answer..."
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
            ) : currentQuestion.type === 'Multiple Choice' ? (
              <>
                {(() => {
                  const { options } = parseMultipleChoice(currentQuestion.answer);
                  return options.map((option, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="multipleChoice"
                        value={option}
                        id={`option-${idx}`}
                        checked={inputAnswer === option}
                        onChange={(e) => setInputAnswer(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`option-${idx}`} className="text-gray-700">{option}</label>
                    </div>
                  ));
                })()}
              </>
            ) : null}
            <Button
              onClick={handleSubmitAnswer}
              className="text-white w-full py-2"
            >
              Submit Answer
            </Button>
          </>
        ) : (
          <div className="text-gray-600">No question available for this section.</div>
        )}
      </div>

      {/* --- Feedback Section (Below Q/A Box) --- */}
      {feedback === "correct" && (
        <div className="flex items-center justify-center mb-6">
          <Image src="/correct.png" alt="Correct" width={32} height={32} />
          <span className="ml-2 text-green-600 font-bold">Correct!</span>
        </div>
      )}
      {feedback === "wrong" && (
        <div className="flex items-center justify-center mb-6">
          <Image src="/wrong.png" alt="Wrong" width={32} height={32} />
          <span className="ml-2 text-red-600 font-bold">Wrong! Try again.</span>
        </div>
      )}

      {/* --- Transition Overlay (Drop-Down, Semi-Transparent) --- */}
      {transitionOverlay !== "" && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center transition-all duration-500">
          {transitionOverlay === "transition" ? (
            <>
              <h2 className="text-3xl text-white font-bold mb-2">Section Completed!</h2>
              <p className="text-white">Preparing for the next section...</p>
            </>
          ) : (
            <>
              <h2 className="text-4xl text-white font-bold mb-4">Congratulations!</h2>
              <p className="text-white mb-6">You have completed the Spanish lesson.</p>
              <Button size="lg" onClick={goToPlan}>
                To Course Plan
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
