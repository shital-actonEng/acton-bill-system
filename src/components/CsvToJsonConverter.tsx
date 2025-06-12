// import React, { useEffect, useState } from 'react';
// import Papa from 'papaparse';

// interface DataItem {
//   id: string;
//   name: string;
//   // Add other properties as needed
// }

// const CsvToJsonConverter = () => {
//   const [jsonData, setJsonData] = useState<DataItem[]>([]);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (file) {
//       Papa.parse<DataItem>(file, {
//         complete: (result) => {
//           setJsonData(result.data);
//         },
//         header: true, // Set to false if your CSV doesn't have headers
//         skipEmptyLines: true,
//       });
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept=".csv"
//         onChange={handleFileChange}
//       />
//       <pre>{JSON.stringify(jsonData, null, 2)}</pre>
//     </div>
//   );
// };

// export default CsvToJsonConverter;

import React from 'react';
import { GetStaticProps } from 'next';


interface CsvDataItem {
  id: string;
  name: string;
  // Include other properties as needed
}

interface HomePageProps {
  csvData: CsvDataItem[];
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
    // Your logic to fetch and parse CSV data
    const csvData: CsvDataItem[] = [
      // Your parsed CSV data here
    ];
  
    return {
      props: {
        csvData,
      },
    };
  };

const HomePage: React.FC<HomePageProps> = ({ csvData }) => {
  return (
    <div>
      <h1>CSV Data</h1>
      <pre>{JSON.stringify(csvData, null, 2)}</pre>
    </div>
  );
};

export default HomePage;
