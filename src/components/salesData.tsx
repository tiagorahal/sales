import React, { useState, useEffect } from "react";

interface Transaction {
  id: number;
  type: string;
  date: string;
  product: string;
  value: number;
  salesperson: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    timeZone: "GMT",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

function formatCurrency(valueInCents: number): string {
  const value = valueInCents / 100;
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatType(type: string): string {
  if (type === "1") {
    return "1 - Sale Producer";
  } else if (type === "2") {
    return "2 - Sale Affiliate";
  } else if (type === "3") {
    return "3 - Paid Commission";
  } else if (type === "4") {
    return "4 - Received Commission";
  } else {
    return type;
  }
}

function SalesData() {
  const [loading, setLoading] = useState<boolean>(true);
  const [sales, setSales] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://644ad55ba8370fb32158e570.mockapi.io/sales/sales_info"
        );

        const data = await response.json();
        console.log(data[0].sales);

        const parsedData = data[0].sales;
        setSales(parsedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-xl text-white font-bold">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-6/12 min-h-screen bg-gray-100">
      <h1 className="text-3xl text-gray-800 my-6">Transactions</h1>
      <div className="flex items-center justify-center max-w-1/2 max-h-1/2 overflow-y-auto">
        <table className="table-auto leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Value
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Salesperson
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.map((transaction) => (
              <tr key={transaction.value + transaction.type + transaction.date}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {formatType(transaction.type)}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {transaction.product}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {formatCurrency(transaction.value)}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {transaction.salesperson}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesData;
