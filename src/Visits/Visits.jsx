import { Base_Url, Image_Url } from "@/config";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 filters
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
const [openImg, setOpenImg] = useState(null);

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
        <input  type="date" value={date}  
        onChange={(e) => {setDate(e.target.value);  setPage(1);   }}
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
    {visits?.map((item) => (
      <div
        key={item._id}
        className="bg-white rounded-xl border border-gray-200
                   shadow hover:shadow-lg transition p-4"
      >
        {/* IMAGE */} 
    {item.asset && (
  <img
    src={`${Image_Url}${item.asset}`}
    alt="asset"
    className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer"
    onClick={() => setOpenImg(`${Image_Url}${item.asset}`)}
  />
)}



        {/* HEADER */}
        <h3 className="text-lg font-bold text-gray-800">
         Dealer Name :   {item.dealerName} 
        </h3>

        <p className="text-sm text-gray-600 pt-2">
          👤<b>Name : </b> {item.employee?.name}
        </p>

        {/* <p className="text-xs text-gray-500">
          📧 <b>  Email : </b> {item.employee?.email}
        </p> */}

        {/* DETAILS */}
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          {/* <p><b>📞 Phone: </b> {item.employee?.phone}</p> */}
          <p><b>🎯 Purpose : </b> {item.purpose}</p>
          <p><b>💳 Payment Mode :</b> {item.paymentMode?.trim() || " -"}</p>
          <p><b>📝 Description : </b>{ item.description?.trim() ? item.description : " No description"}</p>
        </div>

        {/* FOOTER */}
        <div className="mt-4 pt-3 border-t flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">
             ₹ {item.amount ?? 0}
</span>


          <span className="text-xs text-gray-500">
            📅 {item.createdAt}
          </span>
        </div>
      </div>
    ))}
  </div>
)}


{openImg && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
    onClick={() => setOpenImg(null)}
  >
    {/* close button */}
    <button
      className="absolute top-5 right-5 text-white text-3xl font-bold"
      onClick={() => setOpenImg(null)}
    >
      ✕
    </button>

    {/* full image */}
    <img
      src={openImg}
      alt="full"
      className="max-w-[100%] max-h-[100%] rounded-lg shadow-xl"
      onClick={(e) => e.stopPropagation()}
    />
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
