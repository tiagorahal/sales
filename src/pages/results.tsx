import SalesData from "@/components/salesData";
import React from "react";

const Results: React.FC = () => {
  return (
    <div className="p-4 mt-4 w-full bg-gray-500 h-full rounded-lg flex justify-between items-start">
      <SalesData />
    </div>
  );
};

export default Results;