"use client"

import { getTest } from "@/express-api/testRecord/page";
import { useEffect } from "react";
import { useGlobalApiStore } from "@/stores/globalApiStore";

export default function Home() {
  const {updateApiState} = useGlobalApiStore();

   useEffect(() => {
          const fetchData = async () => {
              try {
                  const resultTest = await getTest();
                  updateApiState({ globalTestData : resultTest })
              } catch (error) {
                  console.error("Error fetching test data:", error);
              }
          };
          fetchData();
      }, [])

  return (
    <div >
      {/* <CsvToJsonConverter /> */}
    </div>
  );
}
