// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// const containerStyle = { width: "100%", height: "500px" };

// export default function GoogleMapComponent() {
//   const { id } = useParams();
//   const [locationData, setLocationData] = useState([]); 
//   const [selectedDate, setSelectedDate] = useState(""); // no static date

//   const fetchLocation = async () => {
//     try {
//       const res = await fetch(
//         `https://api.canxinternational.in/api/v1/employees/location/${id}?date=${selectedDate}`
//       );

//       const result = await res.json();

//       if (result.success && result.data.length > 0) {
//         setLocationData(result.data); // array set
//       } else {
//         setLocationData([]); // empty array
//       }
//     } catch (error) {
//       console.log("API Error:", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchLocation();
//     }
//   }, [id, selectedDate]);

//   const defaultCenter = { lat: 28.6139, lng: 77.209 };

//   return (
//     <>
//       {/* Date Filter */}
//       <div className="mb-4">
//         <label className="font-semibold p-2">Select Date: </label> <br />
//         <input
//           type="date"
//           className="border px-3 py-2 rounded ml-2 mt-2"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//         />
//       </div>

//       {/* Map */}
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

//       {/* Cards */}
//       {selectedDate && locationData.length === 0 && (
//         <p className="mt-4 text-red-500 font-semibold">
//           No location found for this date.
//         </p>
//       )}

//       {locationData.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
//           {locationData.map((item, index) => (
//             <div key={index} className="p-4 border-2 border-blue-500 rounded shadow">
//               <p><b>Employee ID:</b> {item.employee}</p>
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

  // 👉 Auto-set today's date when page opens
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
      } else {
        setLocationData([]);
      }
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  useEffect(() => {
    if (selectedDate) fetchLocation();
  }, [id, selectedDate]);

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

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          locationData.length > 0
            ? { lat: +locationData[0].latitude, lng: +locationData[0].longitude }
            : defaultCenter
        }
        zoom={14}
      >
        {locationData.length > 0 && (
          <Marker
            position={{
              lat: +locationData[0].latitude,
              lng: +locationData[0].longitude,
            }}
          />
        )}
      </GoogleMap>

      {selectedDate && locationData.length === 0 && (
        <p className="mt-4 text-red-500 font-semibold">No location found.</p>
      )}

      {locationData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {locationData.map((item, index) => (
            <div key={index} className="p-4 border-2 border-blue-500 rounded shadow">
              <p><b>Employee ID:</b> {item.employee}</p>
              <p><b>Time:</b> {new Date(item.deviceTimestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
