import { Base_Url } from "@/config";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 filters
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");

  const { employeeId } = useParams();

  // -------- GET VISITS API --------
  const getVisits = async () => {
    try {
      let url = `${Base_Url}api/v1/visits/admin/${employeeId}?page=${page}`;

      if (purpose) url += `&purpose=${purpose}`;
      if (date) url += `&date=${date}`;

      const res = await fetch(url);
      const result = await res.json();

      setVisits(result?.data?.visits || []);
      setTotalPages(result?.data?.totalPages || 1);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getVisits();
  }, [page, purpose, date]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔍 FILTER SECTION */}
      <div className="    rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">

        {/* PURPOSE FILTER */}
        <select
          value={purpose}
          onChange={(e) => {
            setPurpose(e.target.value);
            setPage(1);
          }}
         className="border border-gray-300 rounded-lg px-3 py-2 w-48"
        >
          <option value="">All Purpose</option>
          <option value="ORDER">ORDER</option>
          <option value="PAYMENT">PAYMENT</option> 
        </select>

        {/* DATE FILTER */}
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-48"
        />

        {/* RESET */}
        <button
          onClick={() => {
            setPurpose("");
            setDate("");
            setPage(1);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reset
        </button>
      </div>

      {/* NO DATA */}
      {visits.length === 0 && (
        <p className="text-center text-gray-500 py-20">
          No Visits Found
        </p>
      )}

      {/* VISIT CARDS */}
      {visits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-blue-500
                         shadow-sm hover:shadow-md hover:border-blue-600
                         transition-all duration-300 p-5"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.clientName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {item.employee?.email}
                  </p>
                </div>

                <span className="px-3 py-1 text-xs rounded-full
                                 bg-blue-100 text-blue-700 font-semibold">
                  {item.purpose}
                </span>
              </div>

              {/* DETAILS */}
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <b>Phone:</b> {item.employee?.phone}
                </p>

                <p>
                  <b>Payment Mode:</b> {item.paymentMode}
                </p>
              </div>

              {/* FOOTER */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  ₹{item.amount}
                </span>

                <span className="text-xs text-gray-500">
                  📅 {item.createdAt.slice(0, 10)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {visits.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg
                       hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold text-gray-700">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg
                       hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Visits;
