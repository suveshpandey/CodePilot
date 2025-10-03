"use client";

import Navbar from "@/components/primary-comps/Navbar";
import Loader from "@/components/secondary-comps/Loader";
import axios from "axios";
import { BadgePlus, BookOpenCheck, CircleCheckBig, Computer, Repeat, Undo } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GeminiResponse {
    output: string
}

interface QuizQuestion {
    question: string,
    options: string [],
    correct: 0 | 1 | 2 | 3
}

interface UserAnswer {
    questionIndex: number,
    selectedOption: number,
    isCorrect: boolean
}

export default function VideosPage() {
    const [quizTopic, setQuizTopic] = useState<string>("Arrays");
    const [difficultyLevel, setDifficultyLevel] = useState<string>("Easy");
    const [quizLength, setQuizLength] = useState<number>(20);
    const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isInputExpanded, setIsInputExpanded] = useState(false);
    const [topics, setTopics] = useState(
        [
            "Arrays",
            "Linked Lists",
            "Stacks",
            "Queues",
            "Hash Tables",
            "Trees",
            "Binary Search Trees",
            "Graphs",
            "Heaps",
            "Sorting Algorithms",
            "Searching Algorithms",
            "Recursion",
            "Dynamic Programming",
            "Greedy Algorithms",
            "Backtracking",
            "Divide and Conquer",
            "Bit Manipulation",
            "String Algorithms",
            "Graph Traversal"
        ]
    )
    const [customTopic, setCustomTopic] = useState("");
    const [score, setScore] = useState<null | number>(null);
    const [userAns, setUserAns] = useState<UserAnswer[]>([]);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

    const difficultyLevelsArr = [
        {
            level: "Beginner", 
            color: "bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/50",
            markingColor: "text-emerald-500/80"
        },
        {
            level: "Easy", 
            color: "bg-green-500/20 hover:bg-green-500/40 border border-green-500/50",
            markingColor: "text-green-500/80"
        },
        {
            level: "Medium", 
            color: "bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/50",
            markingColor: "text-yellow-500/80"
        },
        {
            level: "Hard", 
            color: "bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/50",
            markingColor: "text-orange-500/80"
        },
        {
            level: "Expert", 
            color: "bg-red-500/20 hover:bg-red-500/40 border border-red-500/50",
            markingColor: "text-red-500/80"
        }
    ];
    const quizLengthArr = [10, 20, 25, 30, 50];

    const handleGenerateQuiz = async () => {
        try {
            setLoading(true);

            const prompt = `Create a quiz of ${quizLength} questions on the topic ${quizTopic} of ${difficultyLevel} level questions. Output format - give me only the array of objects, every object should have question, array of options, correct option's index (0 based).`;
            const res = await axios.post<GeminiResponse>("/api/gemini", {
                prompt: prompt,
                model_name: "gemini-2.5-pro"
            })
            if (!res) {
                console.log("no response came"),
                toast.error("Failed to generate the quiz")
            } else {
                let rawData = res.data.output;

                if (rawData.startsWith("```")) {
                    rawData = rawData.replace(/```json|```/g, "").trim();
                }

                const parsedData = JSON.parse(rawData);
                console.log(parsedData);
                setQuiz(parsedData);
            }

        } catch (error) {
            console.error("Some error occured");
            toast.error("Some error occured while generating the quiz");
        } finally {
            setLoading(false);
        }
    };

    const addNewQuizTopic = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && customTopic.trim() !== "") {
            setTopics(prevTopics => [...prevTopics, customTopic]);
            setQuizTopic(customTopic);
            setCustomTopic("");
            setIsInputExpanded(false);

            toast.success(`Added new topic - ${quizTopic}`);
        }
    }

    const handleAnsSelect = (qIdx: number, opIdx: number) => {
        setUserAns(prev => {
            const newEntry: UserAnswer = {
                questionIndex: qIdx,
                selectedOption: opIdx,
                isCorrect: opIdx === quiz[qIdx].correct
            };

            const existingIndex = prev.findIndex(a => a.questionIndex === qIdx);

            if (existingIndex === -1) { //First time answering this question -> append
                return [...prev, newEntry];
            } else { // Already answerd -> replace that entry with new answer
                const copy = [...prev];
                copy[existingIndex] = newEntry;
                return copy;
            }
        });
    };

    const handleSubmitQuiz = () => {
        if (userAns.length !== quiz.length) {
            toast.warning("Please attend all questions before submitting the quiz.");
            return;
        }
        setIsQuizSubmitted(true);
        let correctCount = 0;
        userAns.forEach((ans) => {
            if (ans.isCorrect) correctCount++;
        })
        setScore(correctCount);
    }

    const handleResetQuiz = () => {
        setIsQuizSubmitted(false);
        setQuiz([]);
        setQuizTopic("Arrays");
        setDifficultyLevel("Easy");
        setQuizLength(20);
        setScore(null);
        setUserAns([]);
    }

    return (
        <div className="h-screen w-full flex flex-col bg-gray-900 text-slate-300">
            {/* Navbar */}
            <div className="h-16 flex items-center">
                <Navbar />
            </div>

            {/* Scrollable Content */}
            <div className="w-full h-[calc(100vh-4rem)] px-10 pb-10">
                <div className="w-full h-full flex overflow-hidden rounded-2xl  border-1 border-slate-700">
                    {/* Left Part */}
                    <div className="w-[30%] h-full overflow-y-auto flex flex-col justify-between bg-slate-800 p-5">
                        <div className="flex flex-col gap-y-10">
                            {/* Select Topic */}
                            <div className="flex flex-col gap-y-4">
                                <p className="text-xl font-semibold">Select a quiz topic :</p>
                                <div className="flex flex-wrap gap-3">
                                    {
                                        topics.map((topic, idx) => (
                                            <span 
                                            key={idx}
                                            onClick={() => setQuizTopic(topic)}
                                            className="relative bg-slate-600 hover:bg-slate-500 py-1 px-3 leading-tight rounded-full flex justify-center items-center border-1 border-slate-500 cursor-pointer transition-all duration-200  "
                                            >{topic} {(quizTopic === topic) && <CircleCheckBig size={20} className="absolute -top-2 -right-2 text-green-600" strokeWidth={3} />}</span>
                                        ))
                                    }
                                    <input 
                                        type="text" 
                                        placeholder={isInputExpanded ? "Add custom topic..." : "+"}
                                        className={`bg-slate-900 hover:bg-slate-950 py-1 px-3 font-semibold leading-tight rounded-full flex justify-center items-center border-1 border-slate-500 hover:border-slate-400 cursor-pointer transition-all duration-200 outline-none ${
                                            isInputExpanded ? "w-40" : "w-10"
                                        }`}
                                        value={customTopic}
                                        onChange={(e) => setCustomTopic(e.target.value)}
                                        onFocus={() => setIsInputExpanded(true)}
                                        onKeyDown={addNewQuizTopic}
                                    />
                                </div>
                            </div>
                            {/* Select Difficulty Level */}
                            <div className="flex flex-col gap-y-4">
                                <p className="text-xl font-semibold">Select difficulty level :</p>
                                <div className="flex flex-wrap gap-3">
                                    {
                                        difficultyLevelsArr.map(({level, color, markingColor}, idx) => (
                                            <span 
                                            key={idx}
                                            onClick={() => setDifficultyLevel(level)} 
                                            
                                            className={`relative ${color} py-1 px-3 rounded-full flex justify-center items-center cursor-pointer transition-all duration-200`}
                                            >{level} {(difficultyLevel === level) && <CircleCheckBig size={20} className={`absolute -top-2 -right-2 ${markingColor}`} strokeWidth={3} />}</span>
                                        ))
                                    }
                                </div>
                            </div>
                            {/* Select No of Questions */}
                            <div className="flex flex-col gap-y-4">
                                <p className="text-xl font-semibold">Select number of MCQs :</p>
                                <div className="flex flex-wrap gap-3">
                                    {
                                        quizLengthArr.map((len, idx) => (
                                            <span 
                                            key={idx}
                                            onClick={() => setQuizLength(len)}
                                            className="relative bg-slate-600 hover:bg-slate-500 py-1 px-3 leading-tight rounded-full flex justify-center items-center border-1 border-slate-500 cursor-pointer transition-all duration-200 "
                                            >{len} {(quizLength === len) && <CircleCheckBig size={20} className="absolute -top-2 -right-2 text-green-600" strokeWidth={3} />} </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        
                        {/* Button Section */}
                        <div className="w-full flex flex-col gap-y-5 justify-center items-center">
                            {quiz.length > 0 && (
                                // Progress bar and Score Section
                                <div className="w-full bg-slate-700/50 p-4 rounded-2xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-slate-400">Progress:</span>
                                        <span className="text-sm font-semibold">
                                            {userAns.length} / {quiz.length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-600 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(userAns.length / quiz.length) * 100}%` }}
                                        ></div>
                                    </div>
                                    {score !== null && (
                                        <div className="mt-3 text-center">
                                            <p className="text-2xl font-bold text-green-400">
                                                {score} / {quiz.length}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {Math.round((score / quiz.length) * 100)}% Correct
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {
                                quiz.length !== 0 ? 
                                (
                                    isQuizSubmitted ? 
                                    <button 
                                    onClick={handleResetQuiz} 
                                    className="flex items-center justify-center group gap-x-3 bg-slate-300 hover:bg-slate-200 px-10 py-3 mx-20 rounded-2xl text-slate-900 font-semibold cursor-pointer transition-all duration-200">
                                        {loading ? <Loader color={"slate-600"} /> : <Repeat className="group-hover:text-yellow-600 transition-all duration-200" /> }Reset Quiz
                                    </button>
                                    : 
                                    <button 
                                    onClick={handleSubmitQuiz} 
                                    className="flex items-center justify-center group gap-x-3 bg-slate-300 hover:bg-slate-200 px-10 py-3 mx-20 rounded-2xl text-slate-900 font-semibold cursor-pointer transition-all duration-200">
                                        {loading ? <Loader color={"slate-600"} /> : <BookOpenCheck className="group-hover:text-green-600 transition-all duration-200" /> }Submit Quiz
                                    </button>
                                )
                                :
                                <button 
                                onClick={handleGenerateQuiz} 
                                className="flex items-center justify-center group gap-x-3 bg-slate-300 hover:bg-slate-200 px-10 py-3 mx-20 rounded-2xl text-slate-900 font-semibold cursor-pointer transition-all duration-200">
                                    {loading ? <Loader color={"slate-600"} /> : <BadgePlus className="group-hover:text-yellow-600 transition-all duration-200" /> }Generate Quiz
                                </button>
                            }
                        </div>
                    </div>
                    {/* Right Part */}
                    <div className="w-[70%] h-full overflow-y-auto flex flex-col gap-y-3 p-5">
                        {quiz.length > 0 ? quiz.map((q, qIdx) => {
                            const userAnswer = userAns.find(ans => ans.questionIndex === qIdx);
                            const isCurrMCQCorrect = userAnswer?.isCorrect;

                            return (
                                <div
                                    key={qIdx}
                                    className={`flex flex-col gap-y-3 p-3 rounded-2xl ${
                                        isQuizSubmitted
                                        ? isCurrMCQCorrect
                                            ? "border-2 border-green-500/60 bg-green-500/5"
                                            : "border-2 border-red-500/40 bg-red-500/5"
                                        : "bg-slate-700"
                                    }`}
                                >
                                    <p>
                                        <span className="text-slate-200 font-semibold">{qIdx + 1}</span>. {q.question}
                                    </p>

                                    {q.options.map((op, opIdx) => {
                                        let optionClass = "text-slate-400";

                                        if (isQuizSubmitted) {
                                            if (opIdx === q.correct) optionClass = "text-green-400 font-semibold";
                                            else if (opIdx === userAnswer?.selectedOption && !isCurrMCQCorrect) optionClass = "text-red-400 font-semibold";
                                        }

                                        return (
                                        <label
                                            key={opIdx}
                                            className={`flex gap-x-2 ml-4 items-center cursor-pointer ${optionClass}`}
                                        >
                                            <input
                                            type="radio"
                                            name={`q-${qIdx}`}
                                            checked={userAnswer?.selectedOption === opIdx}
                                            onChange={() => handleAnsSelect(qIdx, opIdx)}
                                            disabled={isQuizSubmitted}
                                            />
                                            <p>{op}</p>
                                        </label>
                                        );
                                    })}
                                </div>
                            );
                        }): 
                        <div className="h-full w-full flex flex-col justify-center items-center gap-y-5">
                            {
                                loading ? <div className="h-full w-full flex flex-col justify-center items-center gap-y-3">
                                    <Loader color={"slate-500"} />
                                    <p className="text-slate-500">Generating quiz . . .</p>
                                </div> 
                                :
                                <div className="h-full w-full flex flex-col justify-center items-center gap-y-3">
                                    <BookOpenCheck className="size-20 text-slate-400" />
                                    <p className="text-slate-500">Click on the "Generate Quiz" button to generate quiz</p>
                                </div>
                            }
                        </div>
                        }
                    </div>
                </div>
            </div>        
        </div>
    );
}
