import React, { FC, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { styles } from "@/app/styles/style";

type FAQItem = {
    _id: number;
    question: string;
    answer: string;
};

const FAQ: FC = () => {
    const faq: FAQItem[] = [
        {
            _id: 1,
            question: "Will I receive a certificate for each course?",
            answer:
                "Yes — each student who completes any course will receive a certificate of completion to acknowledge their proficiency. " +
                "We encourage students to include these on their LinkedIn profiles and in their job applications!",
        },
        {
            _id: 2,
            question: "Can I get source code of each course?",
            answer: "Yes - You will get source code of all courses when you will watch the course video.",
        },
        {
            _id: 3,
            question: "Can I ask about anything related to the course or if my code doesn't work?",
            answer: "Yes, you can comment on every part of the videos in the course. We'll always try to reply to your comment and fix any issues you may have.",
        },
        {
            _id: 4,
            question: "Can I download any course videos?",
            answer: "For security reasons, course videos cannot be downloaded. However, you have lifetime access to each purchased course and can watch them anytime, anywhere with your account",
        },
    ];

    const [activeQuestions, setActiveQuestions] = useState<number[]>([]);

    const toggleQuestion = (id: number) => {
        setActiveQuestions((prev) =>
            prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
        );
    };

    return (
        <div className="w-[90%] 800px:w-[80%] m-auto">
            <h1 className={`${styles.title} text-center 800px:text-[40px]`}>
                Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <div className="mt-12">
                <dl className="space-y-8">
                    {faq.map((question, index) => (
                        <div
                            key={question._id}
                            className={`${
                                index !== faq.length - 1 ? "border-b" : ""
                            } border-gray-200 pb-6 pt-4 transition-all duration-300`}
                        >
                            <dt className="text-lg">
                                <button
                                    className="flex items-start justify-between w-full text-left transition-all duration-300 p-3 rounded-md"
                                    onClick={() => toggleQuestion(question._id)}
                                >
                  <span
                      className={`font-medium dark:text-white text-black ${
                          activeQuestions.includes(question._id)
                              ? "text-blue-500"
                              : "text-gray-800 dark:text-gray-300"
                      }`}
                  >
                    {question.question}
                  </span>
                                    <span className="ml-6 flex-shrink-0">
                    {activeQuestions.includes(question._id) ? (
                        <HiMinus className="h-6 w-6 text-blue-500" />
                    ) : (
                        <HiPlus className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    )}
                  </span>
                                </button>
                            </dt>
                            <dd
                                className={`mt-2 pr-12 transition-all duration-500 ease-in-out ${
                                    activeQuestions.includes(question._id)
                                        ? "max-h-screen opacity-100"
                                        : "max-h-0 opacity-0 overflow-hidden"
                                }`}
                            >
                                <p className="text-base font-Poppins text-gray-700 dark:text-gray-300 pl-[12px]">
                                    {question.answer}
                                </p>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};

export default FAQ;
