import { useState, useRef } from "react";

const Home = () => {
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
          const lines = reader.result.split("\n").map((line) => {
            const type = line.substring(0, 1);
            const date = line.substring(1, 26);
            const product = line.substring(26, 56);
            const value = line.substring(56, 66).trim().replace(/^0+/, "");
            const salesperson = line.substring(66, 86);
            console.log(type, date, product, value, salesperson);
            return { type, date, product, value, salesperson };
          });
          if (lines.length > 0 && lines[lines.length - 1].salesperson === "") {
            lines.pop();
          }
          setText(lines.map((line) => JSON.stringify(line)));
          setSubmitted(false);

          const sales = lines.map((line) => ({
            type: line.type,
            date: line.date,
            product: line.product,
            value: line.value,
            salesperson: line.salesperson,
          }));

          console.log(JSON.stringify(sales));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const sales = text.map((line) => JSON.parse(line));
      const res = await fetch(
        "https://644ad55ba8370fb32158e570.mockapi.io/sales/sales_info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sales }),
        }
      );
      console.log(await res.json());
      setText([]);
      setSubmitted(true);
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <label
        className="block mb-2 mx-auto sm:mx-4 text-sm font-medium text-gray-900 text-center sm:text-left"
        htmlFor="file_input"
      >
        Upload file
      </label>
      {submitted ? (
        <p className="mb-2 mx-auto sm:mx-4 text-sm font-medium text-green-500 text-center sm:text-left">
          File uploaded successfully!
        </p>
      ) : (
        <input
          className="block w-full sm:max-w-md mx-auto sm:mx-4 text-sm text-gray-900 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700"
          type="file"
          id="file_input"
          onChange={handleUpload}
          ref={fileInputRef}
        />
      )}
      <button
        className="bg-blue-500 mx-auto sm:mx-4 mt-3 mb-5 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        disabled={loading}
        onClick={handleConfirm}
      >
        {loading ? "Uploading data..." : "Confirm upload"}
      </button>
      {text && text.length > 0 ? (
        <div className="overflow-x-auto mx-auto sm:mx-4">
          <table className="table-auto w-full bg-white p-3 rounded-md shadow-lg">
            <thead>
              <tr>
                <th className="p-2">Type</th>
                <th>Date</th>
                <th>Product</th>
                <th>Value</th>
                <th>Salesperson</th>
              </tr>
            </thead>
            <tbody>
              {text.map((line, index) => {
                const { type, date, product, value, salesperson } =
                  JSON.parse(line);
                return (
                  <tr key={index}>
                    <td className="border px-4 py-2">{type}</td>
                    <td className="border px-4 py-2">{date}</td>
                    <td className="border px-4 py-2">{product}</td>
                    <td className="border px-4 py-2">{value}</td>
                    <td className="border px-4 py-2">{salesperson}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
