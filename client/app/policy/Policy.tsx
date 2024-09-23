import React, { FC } from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy: FC<Props> = (props) => {
  return (
    <div>
      <div className="w-[95%] 800px:w-[92%] m-auto py-2 dark:text-white text-black px-3">
        <h1 className={`${styles.title} !text-start pt-2`}>
          Platform Terms and Condition
        </h1>
        <ul className="ml-[15px] list-none">
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae a
            facilis error corporis quas quisquam, eligendi praesentium suscipit
            sed cupiditate quaerat dicta facere ipsum, nulla, illum ut expedita?
            Modi, omnis.
          </p>
          <br />
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae a
            facilis error corporis quas quisquam, eligendi praesentium suscipit
            sed cupiditate quaerat dicta facere ipsum, nulla, illum ut expedita?
            Modi, omnis.
          </p>
          <br />
        </ul>
      </div>
    </div>
  );
};

export default Policy;
