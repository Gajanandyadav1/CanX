import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Base_Url } from "@/config";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getClaims = async () => {
    try {
      const res = await fetch(`${Base_Url}api/v1/claims/admin?page=${page}`);
      const data = await res.json();
      setClaims(data?.data?.claims || []);
      setTotalPages(data?.data?.totalPages || 1);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getClaims();
  }, [page]);

  return (
    <div className="p-5">

      {/* No Data Found */}
      {claims.length === 0 && (
        <div className="text-center text-gray-500 text-xl py-20">
          No Data Found
        </div>
      )}

      {/* Cards */}
      {claims.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {claims.map((item) => {
            const imgUrl = item.bill
              ? `https://api.canxinternational.in/uploads/${item.bill}`
              : null;

            return (
              <div
                key={item._id}
                className="rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100"
              >
                {/* IMAGE WITH PLACEHOLDER (NO UI BREAK) */}
                <div className="relative h-52 w-full bg-gray-200 flex items-center justify-center">

                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt="bill"
                      className="h-52 w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML =
                          "<div class='flex items-center justify-center w-full h-full text-gray-600 text-sm'>No Image Found</div>";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-600 text-sm">
                      No Image Found
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  {/* NAME + STATUS BADGE */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.employee?.name}
                    </h2>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full shadow 
                        ${
                          item.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* TITLE */}
                  <p className="text-gray-500 text-sm mb-3">{item.title}</p>

                  {/* DETAILS (2–2 per row) */}
                  <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
                    <p><b>Amount:</b> ₹{item.amount}</p>
                    <p><b>Phone:</b> {item.employee?.phone}</p>
                    <p><b>Email:</b> {item.employee?.email}</p>
                    <p><b>Description:</b> {item.description}</p>
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-gray-500 text-sm">
                      📅 {item.createdAt.slice(0, 10)}
                    </span>

                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                      <Eye size={18} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {claims.length > 0 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold text-gray-700">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default Claims;
