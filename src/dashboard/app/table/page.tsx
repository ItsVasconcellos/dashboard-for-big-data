"use client"
import { getVehicles } from "@/api/vehicles/get";
import TableComponent from "@/components/table";
import { Tabs,TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function TablePage(){
    const [activeTab, setActiveTab] = useState("dealers");
    const { data: Vehicles, isLoading, error } = useQuery({
      queryKey: ["vehicles"],
      queryFn: () => getVehicles(),
    });
    // const { data: dealersData, isLoading: dealersLoading, error: dealersError } = useQuery({
    //   queryKey: ["dealers"],
    //   queryFn: () => (return {[]}),
    // });
    const filteredVehicles = Vehicles?.map(item => {
      const { accidents, services, ...rest } = item;
      return rest;
    });
    if(isLoading ) return <div>Loading...</div>
    return(

    <div className="max-w-7xl mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dealers">Dealers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        </TabsList>
        <TabsContent value="dealers">
        </TabsContent>
        <TabsContent value="vehicles">
          <TableComponent columns={filteredVehicles ? Object.keys(filteredVehicles[0] || {}).map(key => ({ accessorKey: key, header: key })) : []} data={filteredVehicles ?? []}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}