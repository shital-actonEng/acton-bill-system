// "use client";

// import { useState } from "react";
// import Select from "react-select";
// import { TextField } from "@mui/material";
// import countryList from "react-select-country-list";

// const MobileNumberInput = () => {
//   // Country Code Options (With Flags)
//   const countries = countryList().getData().map((country) => ({
//     value: country.value,
//     label: (
//       <div className="flex items-center gap-2">
//         <img
//           src={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png`} // Flag Image
//           alt={country.label}
//           className="w-5 h-4"
//         />
//         +{getCountryCode(country.value)} {/* Get country calling code */}
//       </div>
//     ),
//   }));

//   // Function to get country calling code
//   function getCountryCode(countryCode: string) {
//     const countryCodes: { [key: string]: string } = {
//       US: "1",
//       IN: "91",
//       GB: "44",
//       CA: "1",
//       AU: "61",
//       // Add more country codes as needed
//     };
//     return countryCodes[countryCode] || "1"; // Default to +1
//   }

//   const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default country
//   const [phoneNumber, setPhoneNumber] = useState("");

//   return (
//     <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 w-96">
//       {/* Country Code Selector */}
//       <Select
//         options={countries}
//         value={selectedCountry}
//         onChange={(option) => setSelectedCountry(option)}
//         className="w-28"
//       />

//       {/* Phone Number Input */}
//       <TextField
//         type="tel"
//         variant="outlined"
//         placeholder="Enter mobile number"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         className="flex-1"
//         inputProps={{
//           maxLength: 15,
//         }}
//       />
//     </div>
//   );
// };

// export default MobileNumberInput;
