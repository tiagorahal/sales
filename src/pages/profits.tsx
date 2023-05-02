import React, { useEffect, useState } from "react";

type Profits = {
  [key: string]: number;
};

const ProfitsTable = (): JSX.Element => {
  const [profits, setProfits] = useState<Profits>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3005/sales/profits", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // Convert profits from cents to dollars
        const profitsInDollars = Object.fromEntries(
          Object.entries(data).map(([salesperson, profitInCents]) => [
            salesperson,
            Number(profitInCents) / 100,
          ])
        );
        setProfits(profitsInDollars);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProfits = Object.fromEntries(
    Object.entries(profits).filter(([salesperson]) =>
      salesperson.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4">
      <div className="mb-2 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search salesperson"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border outline-none w-max-[350px]"
        />
      </div>
      {Object.keys(filteredProfits).length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2">Salesperson</th>
              <th className="p-2">Profit (USD)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredProfits).map(([salesperson, profitInDollars], index) => (
              <tr
                key={salesperson}
                className={
                  index % 2 === 0
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                }
              >
                <td className="p-2">{salesperson}</td>
                <td className="p-2">$ {profitInDollars.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default ProfitsTable;