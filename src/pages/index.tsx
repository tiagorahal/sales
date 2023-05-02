import { useState, useRef } from "react";
import { useRouter } from "next/router";


type SalesRecord = {
  type: string;
  date: string;
  product: string;
  value: string;
  salesperson: string;
};

const Upload = (): JSX.Element => {
  const router = useRouter();
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
            const date = line.substring(1, 26);
            const product = line.substring(26, 56).trim();
            const value = line.substring(56, 66).trim().replace(/^0+/, "");
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
      await fetch("http://localhost:3005/sales/create-sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: salesRecordsJSON,
      });
      setSubmitted(true);
      setSalesRecords([]);
      router.push("/results");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fileInputRef.current && (fileInputRef.current.value = "");
    setSubmitted(false);
    setSalesRecords([]);
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
        <div className="mb-2 mx-auto sm:mx-4 text-sm font-medium text-green-500">
          File submitted.
        </div>
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
            className="hidden sm:block py-1 px-4 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            Choose file
          </button>
          {salesRecords.length > 0 && (
            <table className="w-full mt-4 border-collapse border border-gray-500">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-2">Type</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">Salesperson</th>
                </tr>
              </thead>
              <tbody>
                {salesRecords.map((record, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="p-2 border border-gray-500">
                      {record.type}
                    </td>
                    <td className="p-2 border border-gray-500">
                      {record.date}
                    </td>
                    <td className="p-2 border border-gray-500">
                      {record.product}
                    </td>
                    <td className="p-2 border border-gray-500">
                      {record.value}
                    </td>
                    <td className="p-2 border border-gray-500">
                      {record.salesperson}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {loading ? (
        <div className="mt-4 animate-pulse">Submitting file...</div>
      ) : (
        !submitted &&
        salesRecords.length > 0 && (
          <div className="mt-4 text-center">
            <button
              className="inline-block bg-gray-700 hover:bg-gray-800 py-2 px-4 text-white text-sm font-medium rounded-md"
              onClick={handleConfirm}
            >
              Submit
            </button>{" "}
            <button
              className="inline-block bg-gray-700 hover:bg-gray-800 py-2 px-4 text-white text-sm font-medium rounded-md"
              onClick={handleReset}
            >
              Go back
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Upload;
