import { Base_Url, Image_Url } from "@/config";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Visits = () => {
  const { id } = useParams();

  // ✅ Default Today Date
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [visits, setVisits] = useState([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addressMap, setAddressMap] = useState({});

  // ---------------- FETCH VISITS ----------------
  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${Base_Url}api/v1/visits/employee/${id}?date=${date}`
      );
      const result = await res.json();

      if (result.success) {
        setVisits(result.data.visits || []);
        setTotalKm(result.data.totalKm || 0);
      } else {
        setVisits([]);
        setTotalKm(0);
      }
    } catch (err) {
      console.log("Visits Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GET ADDRESS FROM LAT LNG ----------------
  const getAddressFromLatLng = async (lat, lng, visitId) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      setAddressMap((prev) => ({
        ...prev,
        [visitId]: data.display_name || "Address not found",
      }));
    } catch (err) {
      console.log("Address Error", err);
    }
  };

  // ---------------- FORMAT ADDRESS ----------------
  const formatAddress = (address) => {
    if (!address) return "Loading address...";
    return address
      .split(",")
      .filter(
        (part) =>
          !/\d{6}/.test(part) && part.toLowerCase() !== "india"
      )
      .slice(0, 3)
      .join(", ");
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (id && date) {
      fetchVisits();
    }
  }, [id, date]);

  useEffect(() => {
    visits.forEach((item) => {
      if (item.latitude && item.longitude && !addressMap[item._id]) {
        getAddressFromLatLng(item.latitude, item.longitude, item._id);
      }
    });
  }, [visits]);

  // ---------------- UI ----------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔝 HEADER + DATE */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold">Employee Visits</h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 mt-3 md:mt-0"
        />
      </div>

      {/* TOTAL KM */}
      <div className="mb-6 text-lg font-semibold text-green-600">
        🚗 Total Distance : {totalKm} KM
      </div>

      {/* LOADING */}
      {loading && <p className="text-center">Loading...</p>}

      {/* NO DATA */}
      {!loading && visits.length === 0 && (
        <p className="text-center text-gray-500 py-20">
          No visits found for selected date
        </p>
      )}

      {/* VISIT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visits.map((item) => (
  <div
    key={item._id}
    className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
  >
    {/* IMAGE */}
    {item.asset && (
      <img
        src={`${Image_Url}${item.asset}`}
        alt="visit"
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
    )}

    {/* TITLE */}
    <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
      🏪 <span>{item.dealerName}</span>
    </h3>

    {/* ADDRESS */}
    <div className="text-sm text-gray-600 flex gap-2 mb-2">
      📍
      <span className="line-clamp-2">
        {formatAddress(addressMap[item._id])}
      </span>
    </div>

    {/* DETAILS */}
    <div className="text-sm text-gray-700 space-y-1 mt-2">
      <p className="flex items-center gap-2">
        🎯 <span><b>Purpose:</b> {item.purpose}</span>
      </p>

      <p className="flex items-center gap-2">
        💰 <span><b>Amount:</b> ₹ {item.amount ?? 0}</span>
      </p>

      <p className="flex items-start gap-2">
        📝
        <span>
          <b>Description:</b>{" "}
          {item.description?.trim() || "No description"}
        </span>
      </p>
    </div>

    {/* DISTANCE BADGE */}
    <div className="mt-4 bg-green-50 text-green-700 text-sm font-semibold py-2 px-3 rounded-lg text-center">
      🚗 Distance from previous: {item.distanceFromPrevKm} KM
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default Visits;
