import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Base_Url, Image_Url } from "@/config";
import { toast, Toaster } from "sonner";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
const [openModal, setOpenModal] = useState(false);
const [selectedClaim, setSelectedClaim] = useState(null);
const [newStatus, setNewStatus] = useState("");
const [reason, setReason] = useState("");

  // ---------- API ----------
  const getClaims = async () => {
    try {
      const res = await fetch(
        `${Base_Url}api/v1/claims/admin?page=${page}`
      );
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
 
  
  // ---------- FILTER LOGIC ----------
  const filteredClaims =
    statusFilter === "ALL"
      ? claims
      : claims.filter((item) => item.status === statusFilter);



      const updateClaimStatus = async () => {
  try {
    if (!newStatus || !reason) {
      toast.error("Status aur reason dono bharna zaroori hai");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      employee: selectedClaim?.employee?._id,
      claimId: selectedClaim?._id,
      status: newStatus,
      response: reason,
    });

    const res = await fetch(
      `${Base_Url}api/v1/claims`,
      {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
      }
    );

    const result = await res.json();

     if (res.ok) {
      toast.success(result?.message);
      getClaims()
    } else {
      toast.error(result?.message);
    }

    // reset + close
    setOpenModal(false);
    setNewStatus("");
    setReason(""); 
    // refresh list
    getClaims();

  } catch (error) {
    toast.error("Server error");
    console.log(error);
  }
};

  return (
    <div className="p-5">
    <Toaster position="top-right" />      {/* STATUS SELECT */}
     <div className="mb-6 flex justify-start">
      <div className="relative w-48">
        <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="w-full appearance-none rounded-xl border border-gray-300 
      bg-white px-4 py-2.5 text-sm font-medium text-gray-700
      shadow-sm cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-blue-500
      hover:border-blue-400 transition"
    >
      <option value="ALL">All Claims</option>
      <option value="PENDING">Pending</option>
      <option value="APPROVED">Approved</option>
      <option value="REJECTED">Rejected</option>
    </select>

    {/* DOWN ARROW */}
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</span>
  </div>
</div>


      {/* NO DATA */}
      {filteredClaims.length === 0 && (
        <div className="text-center text-gray-500 text-xl py-20">
          No Data Found
        </div>
      )}

      {/* CARDS */}
      {filteredClaims.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClaims.map((item) => {
            const imgUrl = item.bill
              ? `${Image_Url}${item.bill}`
              : null;

            return (
              <div
                key={item._id}
                className="rounded-2xl bg-white shadow-lg border"
              >
                {/* IMAGE */}
                <div className="h-52 bg-gray-200 flex items-center justify-center">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt="bill"
                      className="h-52 w-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">
                      No Image Found
                    </span>
                  )}
                </div>

                {/* CONTENT */}
              <div className="p-5">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg">
                      {item.employee?.name}
                    </h2>

                    <span
                      className={`px-3 py-1 text-xs rounded-full
                        ${ item.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : item.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm pt-3">
                    <p><b>Amount:</b> ₹{item.amount}</p>
                    <p><b>Title/Reson:</b> {item.title}</p>
                    {/* <p><b>Email:</b> {item.employee?.email}</p>
                    <p><b>Phone:</b> {item.employee?.phone}</p> */}
                  </div>
                  <p className="pt-2 text-sm">
                    <b>Description:</b> {item.description}
                  </p>
                  {item.status !== "PENDING" && item.response && (
                    <div className=" pt-2 bg-gray-50   rounded-lg">
                       <p className="text-sm text-gray-700">
                        <b>  Reson  : </b> {item.response}
                      </p>
                    </div>
                  )}


                  {/* RESPONSE ONLY FOR APPROVED / REJECTED */}
                  

                  {/* FOOTER */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      📅 {item.createdAt.slice(0, 10)}
                    </span>

                    {item.status === "PENDING" ? (
                      <button
                        onClick={() => {
                          setSelectedClaim(item);
                          setOpenModal(true);
                        }}
                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg"
                      >
                        Change Status
                      </button>
                    ) : (
                      <button className="p-2 bg-gray-100 rounded-lg">
                        <Eye size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div> 
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {filteredClaims.length > 0 && (
        <div className="flex justify-center gap-3 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}






      {openModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-xl p-6">
      
      <h2 className="text-lg font-semibold mb-4">
        Change Claim Status
      </h2>

      {/* STATUS SELECT */}
      <label className="block text-sm font-medium mb-1">
        Select Status
      </label>
      <select
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      >
        <option value="">Select</option>
        <option value="APPROVED">Approve</option>
        <option value="REJECTED">Reject</option>
      </select>

      {/* REASON */}
      <label className="block text-sm font-medium mb-1">
        Reason
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 h-24 mb-4"
        placeholder="Enter reason..."
      />

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setOpenModal(false);
            setNewStatus("");
            setReason("");
          }}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            console.log({
              claimId: selectedClaim?._id,
              status: newStatus,
              reason: reason,
            });
            setOpenModal(false);
            updateClaimStatus();
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Claims;
