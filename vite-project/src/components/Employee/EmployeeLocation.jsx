import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmployeeLocation() {
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
const { id } = useParams(); 

 

 alert(id)
  const fetchData = async () => {
    try {
      const url = date
        ? `https://api.canxinternational.in/api/v1/employees/location/691b1dfead00b47576c06c05?date=${date}`
        : `https://api.canxinternational.in/api/v1/employees/location/${id}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Employee Location</h2>

      {/* Date Input */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border px-3 py-2 rounded-lg mb-4"
      />

      {/* Show Data */}      {data.length === 0 ? (
        <p>No Data Found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 shadow-lg border rounded-xl bg-white"
            >
              <h3 className="text-lg font-semibold mb-2">
                Employee: {item.employee}
              </h3>

              <p className="text-gray-700">
                <b>Latitude:</b> {item.latitude}
              </p>

              <p className="text-gray-700">
                <b>Longitude:</b> {item.longitude}
              </p>

              <p className="text-gray-700">
                <b>Device Time:</b>{" "}
                {new Date(item.deviceTimestamp).toLocaleString()}
              </p>

              <p className="text-gray-700">
                <b>Created At:</b>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
