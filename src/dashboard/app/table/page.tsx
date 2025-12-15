
import { getVehicles } from "@/api/vehicles/get";
import TablePage from "./table";

export default async function Table(){
  const cars = await getVehicles();
  console.log(cars);

  // useEffect(() => {
  //     console.log("Active Tab:", activeTab);
  //   }, [activeTab]);

  return(
    <div className="max-w-7xl mx-auto py-8">
      <TablePage/>
    </div>
  );
}