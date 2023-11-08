import React from "react";
import { ImSpinner2 } from "react-icons/im";

const Loading = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto flex-grow min-h-screen p-4 md:p-8 relative max-lg:py-10">
      <div className="flex justify-center items-center h-full">
        <ImSpinner2 size={25} color="red" className="animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
