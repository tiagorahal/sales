import React, { useState, useEffect } from "react";
import axios from "axios";

type Affiliate = string;

export default function AffiliateTable() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [affiliatesPerPage, setAffiliatesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAffiliates = async () => {
      const response = await axios.get<Affiliate[]>(
        "http://localhost:3005/sales/affiliates-associates"
      );
      setAffiliates(response.data);
    };
    fetchAffiliates();
  }, []);

  const indexOfLastAffiliate = currentPage * affiliatesPerPage;
  const indexOfFirstAffiliate = indexOfLastAffiliate - affiliatesPerPage;
  const currentAffiliates = affiliates
    .filter((affiliate) =>
      affiliate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstAffiliate, indexOfLastAffiliate);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(affiliates.length / affiliatesPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }
    return (
      <div>
        {pageNumbers.map((pageNumber) => (
          <button
            className={
              "px-2 py-1 m-2 rounded focus:outline-none " +
              (currentPage === pageNumber ? "bg-gray-800 text-white" : "")
            }
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    );
  };

  const renderResultsPerPage = () => {
    return (
      <div className="inline-block">
        <label htmlFor="results-select" className="pr-2">
          Results per page:
        </label>
        <select
          id="results-select"
          value={affiliatesPerPage}
          onChange={(e) => {
            setAffiliatesPerPage(parseInt(e.target.value));
            setCurrentPage(1);
          }}
          className="px-2 py-1 mr-2 border rounded focus:outline-none"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    );
  };

  const renderSearchBar = () => {
    return (
      <div className="inline-block">
        <label htmlFor="search-input" className="pr-2">
          Search:
        </label>
        <input
          type="text"
          id="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2 py-1 mr-2 border rounded focus:outline-none"
        />
      </div>
    );
  };

  return (
    <div className="p-4 w-full h-full">
      <div className="flex flex-row justify-between items-center mb-4">
        {renderResultsPerPage()}
        {renderSearchBar()}
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {currentAffiliates.map((affiliate, index) => {
            const [name, type] = affiliate.split(",");
            return (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? "bg-gray-200" : "bg-white hover:bg-gray-100"
                }
              >
                <td className="p-2">{name}</td>
                <td className="p-2">
                  {(type === "type1-only"
                    ? "Producer"
                    : type || "Affiliate"
                  ).toUpperCase()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-row justify-center mt-4">
        {renderPagination()}
      </div>
    </div>
  );
}
