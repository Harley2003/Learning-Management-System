import React, { FC, useEffect, useState } from "react";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { styles } from "@/app/styles/style";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {};

const FAQ: FC<Props> = (props) => {
  const { data } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQestion = (id: any) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };
  return (
    <div>
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <h1 className={`${styles.title} 800px:text-[40px]`}>
          Frequently Asked Questions
        </h1>
        <div className="mt-12">
          <dl className="space-y-8">
            {questions.map((question) => (
              <div
                key={question._id}
                className={`${
                  question._id !== question[0]?._id && "border-t"
                } border-gray-200 pt-6`}
              >
                <dt className="text-lg">
                  <button
                    className="flex items-start justify-between w-full text-left focus:outline-none"
                    onClick={() => toggleQestion(question._id)}
                  >
                    <span className="font-medium dark:text-white text-black">
                      {question.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      {activeQuestion === question._id ? (
                        <HiMinus className="h-6 w-6 dark:text-white text-black" />
                      ) : (
                        <HiPlus className="h-6 w-6 dark:text-white text-black" />
                      )}
                    </span>
                  </button>
                </dt>
                {activeQuestion === question._id && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base font-Poppins dark:text-white text-black">
                      {question.answer}
                    </p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
