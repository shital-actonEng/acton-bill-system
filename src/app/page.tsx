"use client"

export default function Home() {
  // const {updateApiState} = useGlobalApiStore();

  //  useEffect(() => {
  //         const fetchData = async () => {
  //             try {
  //                 const resultTest = await getTest();
  //                 updateApiState({ globalTestData : resultTest })
  //             } catch (error) {
  //                 console.error("Error fetching test data:", error);
  //             }
  //         };
  //         fetchData();
  //     }, [])
console.log("API:", process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL);
  return (
    <div >
      {/* <CsvToJsonConverter /> */}
    </div>
  );
}
