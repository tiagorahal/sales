import { useState } from "react";

const Home = () => {
  const [text, setText] = useState<string[]>([]);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const lines = reader.result.split("\n").map((line) => {
            const type = line.substring(0, 1);
            const date = line.substring(1, 26);
            const product = line.substring(26, 56);
            const value = line.substring(56, 66);
            const salesperson = line.substring(66, 86);
            console.log(type, date, product, value, salesperson);
            return { type, date, product, value, salesperson };
          });
          if (lines.length > 0 && lines[lines.length - 1].salesperson === "") {
            lines.pop();
          }
          setText(lines.map((line) => JSON.stringify(line)));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirm = async () => {
    const json = JSON.stringify({ content: text });
    try {
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      console.log(await res.json());
      setText([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <label
        className="block mb-2 mx-4 text-sm font-medium text-gray-900"
        htmlFor="file_input"
      >
        Upload file
      </label>
      <input
        className="block max-w-[300px] mx-4 text-sm text-gray-900 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 "
        type="file"
        id="file_input"
        onChange={handleUpload}
      />
       <button
        className="bg-blue-500 mx-4 mt-3 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleConfirm}
      >
        Confirm upload
      </button>
      <p className="mx-4 mt-5 mb-1 text-2xl font-bold text-white">This is your uploaded data:</p>
      <ul className="mx-4 mb-8 p-4 bg-gray-100 rounded-lg shadow-md border-2">
        {text &&
          text.filter(Boolean).map((line, index) => {
            return (
              <li className="my-2" key={index}>
                {line}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Home;
