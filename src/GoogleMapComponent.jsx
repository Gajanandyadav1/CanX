// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { GoogleMap, Marker } from "@react-google-maps/api";
// import { Base_Url } from "./config";

// const containerStyle = { width: "100%", height: "500px" };

// export default function GoogleMapComponent() {
//   const { id } = useParams();
//   const [locationData, setLocationData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");

//   // 👉 Auto-set today's date when page opens
//   useEffect(() => {
//     const today = new Date().toISOString().slice(0, 10);
//     setSelectedDate(today);
//   }, []);

//   const fetchLocation = async () => {
//     try {
//       const res = await fetch(
//         `${Base_Url}api/v1/employees/location/${id}?date=${selectedDate}`
//       );
//       const result = await res.json();
//       if (result.success && result.data.length > 0) {
//         setLocationData(result.data);
//       } else {
//         setLocationData([]);
//       }
//     } catch (error) {
//       console.log("API Error:", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) fetchLocation();
//   }, [id, selectedDate]);

//   const defaultCenter = { lat: 28.6139, lng: 77.209 };

//   return (
//     <>
//       <div className="mb-4">
//         <label className="font-semibold p-2">Select Date: </label> <br />
//         <input
//           type="date"
//           className="border px-3 py-2 rounded ml-2 mt-2"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//         />
//       </div>

//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={
//           locationData.length > 0
//             ? { lat: +locationData[0].latitude, lng: +locationData[0].longitude }
//             : defaultCenter
//         }
//         zoom={14}
//       >
//         {locationData.length > 0 && (
//           <Marker
//             position={{
//               lat: +locationData[0].latitude,
//               lng: +locationData[0].longitude,
//             }}
//           />
//         )}
//       </GoogleMap>

//       {selectedDate && locationData.length === 0 && (
//         <p className="mt-4 text-red-500 font-semibold">No location found.</p>
//       )}

//       {locationData.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
//           {locationData.map((item, index) => (
//             <div key={index} className="p-4 border-2 border-blue-500 rounded shadow">

//               <p><b>Time:</b> {new Date(item.deviceTimestamp).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Base_Url } from "./config";

const containerStyle = { width: "100%", height: "500px" };

export default function GoogleMapComponent() {
  const { id } = useParams();
  const [locationData, setLocationData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [activeLocation, setActiveLocation] = useState(null);

  const [addressList, setAddressList] = useState({}); // Card ke liye address
  const [currentAddress, setCurrentAddress] = useState("");
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setSelectedDate(today);
  }, []);

  const fetchLocation = async () => {
    try {
      const res = await fetch(
        `${Base_Url}api/v1/employees/location/${id}?date=${selectedDate}`
      );
      const result = await res.json();

      if (result.success && result.data.length > 0) {
        setLocationData(result.data);

        // Default first location
        const first = result.data[0];
        setActiveLocation(first);
        fetchAddress(first.latitude, first.longitude, first.deviceTimestamp);
      } else {
        setLocationData([]);
        setActiveLocation(null);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const fetchAttendance = async () => {
    try {
      const response = await fetch(
        `${Base_Url}api/v1/attendance/admin/employee/${id}?date=${selectedDate}`
      );
      const result = await response.json();
      if (result.success && Object.keys(result.data).length > 0) {
        setAttendanceData(result.data);
      } else {
        setAttendanceData({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Attendance Data:", attendanceData);

  useEffect(() => {
    if (selectedDate) fetchAttendance();
  }, [id, selectedDate]);

  useEffect(() => {
    if (selectedDate) fetchLocation();
  }, [id, selectedDate]);

  // 👉 Reverse Geocoding (lat,lng → Address)
  const fetchAddress = async (lat, lng, key) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCUf5l0MvNpqpUB2mb9gxz0EcmlybwrpsA`
      );

      const data = await res.json();
      const addr =
        data.results.length > 0
          ? data.results[0].formatted_address
          : "Address not found";

      setAddressList((prev) => ({ ...prev, [key]: addr }));

      if (activeLocation && activeLocation.deviceTimestamp === key) {
        setCurrentAddress(addr);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardClick = (item) => {
    setActiveLocation(item);
    setCurrentAddress(addressList[item.deviceTimestamp] || "Loading...");
    fetchAddress(item.latitude, item.longitude, item.deviceTimestamp);
  };

  const defaultCenter = { lat: 28.6139, lng: 77.209 };

  return (
    <>
      <div className="mb-4">
        <label className="font-semibold p-2">Select Date: </label> <br />
        <input
          type="date"
          className="border px-3 py-2 rounded ml-2 mt-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          activeLocation
            ? { lat: +activeLocation.latitude, lng: +activeLocation.longitude }
            : defaultCenter
        }
        zoom={15}
      >
        {activeLocation && (
          <Marker
            position={{
              lat: +activeLocation.latitude,
              lng: +activeLocation.longitude,
            }}
          />
        )}
      </GoogleMap>

      {Object.keys(attendanceData).length > 0 && (
        <>
          <div className="mx-3">
            <p className="mt-3 font-semibold text-blue-600">Attendance :</p>

            <p>
              {" "}
              check-in : {new Date(attendanceData.checkInTime).toLocaleString()}
            </p>
            {attendanceData.checkOutTime && (
              <>
                <p>
                  {" "}
                  check-out : {" "}
                  {new Date(attendanceData.checkOutTime).toLocaleString()}
                </p>
                <p>total-distance : {attendanceData.totalDistance} km</p>
                <p>total-fare: ₹ {attendanceData.totalFare}</p>
                <p>per-km-fare: ₹ {attendanceData.perKmFare}</p>
              </>
            )}
          </div>
        </>
      )}

      {/* SELECTED ADDRESS */}
      {activeLocation && (
        <p className="mt-3 font-semibold text-blue-600">
          📍 Address: {currentAddress}
        </p>
      )}

      {/* CARDS – Only Address Show */}
      {locationData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {locationData.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item)}
              className={`p-4 border-2 rounded cursor-pointer shadow ${
                activeLocation?.deviceTimestamp === item.deviceTimestamp
                  ? "border-red-500"
                  : "border-blue-500"
              }`}
            >
              <p>
                <b>Time:</b> {new Date(item.deviceTimestamp).toLocaleString()}
              </p>
              <p>
                <b>Name:</b> {item?.employee?.name}
              </p>

              <p className="mt-2 text-gray-700">
                <b>Address:</b>{" "}
                {addressList[item.deviceTimestamp] || "Loading..."}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
