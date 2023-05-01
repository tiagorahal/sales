import { useState, useRef } from "react";

type SalesRecord = {
  type: string;
  date: string;
  product: string;
  value: number;
  salesperson: string;
};

const Home = () => {
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [text, setText] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const lines = reader.result.split("\n");
          if (lines[lines.length - 1] === "") {
            lines.pop();
          }

          const salesRecords: SalesRecord[] = [];
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const type = line.substring(0, 1);
            const date = new Date(line.substring(1, 26)).toISOString();
            const product = line.substring(26, 56).trim();
            const value = parseInt(
              line.substring(56, 66).trim().replace(/^0+/, "")
            );
            const salesperson = line.substring(66, 86);

            const salesRecord: SalesRecord = {
              type,
              date,
              product,
              value,
              salesperson,
            };
            salesRecords.push(salesRecord);
          }

          setText(lines.map((line) => JSON.stringify(line)));
          setSubmitted(false);
          setSalesRecords(salesRecords);

          console.log(JSON.stringify(salesRecords));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const salesRecordsJSON = JSON.stringify(salesRecords); 
      const res = await fetch("http://localhost:3005/sales/create-sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: salesRecordsJSON, 
      });
      const data = await res.json();
      console.log(data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full bg-gray-500 h-full rounded-lg">
      <label
        className="block mb-2 mx-auto sm:mx-4 text-sm font-medium text-gray-900 text-center sm:text-left"
        htmlFor="file_input"
      >
        Upload file
      </label>
      {submitted ? (
        <p className="mb-2 mx-auto sm:mx-4 text-sm font-medium">
          File submitted for processing.
        </p>
      ) : (
        <div>
          <input
            className="sm:hidden"
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleUpload}
          />
          <button
            className="hidden sm:block py-1 px-4 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
            onClick={() => fileInputRef?.current?.click()}
          >
            Upload file
          </button>
          <div className="mt-4 max-h-72 overflow-y-auto">
            {text.map((line, index) => (
              <pre key={index} className="text-left text-sm">
                {line}
                <br />
              </pre>
            ))}
          </div>
          {salesRecords.length > 0 && (
            <>
              <hr className="my-4" />
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
                <p className="text-sm font-medium text-gray-900 mb-2 sm:mb-0">
                  Confirm processing of {salesRecords.length} records?
                </p>
                <button
                  className={`py-1 px-4 rounded-md text-sm font-medium text-gray-700 sm:ml-4 focus:outline-none focus:ring-2 focus:ring-gray-200 ${
                    loading ? "animate-pulse" : ""
                  }`}
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
