import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="w-7 h-7 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
