import { useEffect, useState } from "react";
interface Sale {
  id: number;
  type: string;
  date: string;
  product: string;
  value: string;
  salesperson: string;
}

const AllSales = (): JSX.Element => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    async function fetchSales() {
      const response = await fetch("http://localhost:3005/sales/all-sales");
      const data = await response.json();
      setSales(data);
    }
    fetchSales();
  }, []);

  return (
    <div className="mx-auto w-6/12 bg-white rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4">All Sales</h1>
      <div className="bg-white shadow-md rounded my-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2 text-left font-semibold text-sm">Type</th>
              <th className="px-4 py-2 text-left font-semibold text-sm">Date</th>
              <th className="px-4 py-2 text-left font-semibold text-sm">Product</th>
              <th className="px-4 py-2 text-left font-semibold text-sm">Value</th>
              <th className="px-4 py-2 text-left font-semibold text-sm">
                Salesperson
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr className="border-b border-gray-300" key={sale.id}>
                <td className="px-4 py-2 text-sm">{sale.type}</td>
                <td className="px-4 py-2 text-sm">{sale.date}</td>
                <td className="px-4 py-2 text-sm">{sale.product}</td>
                <td className="px-4 py-2 text-sm">{sale.value}</td>
                <td className="px-4 py-2 text-sm">{sale.salesperson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSales;