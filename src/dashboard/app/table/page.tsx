"use client"
import { getDealers } from "@/api/dealers/get";
import { getVehicles } from "@/api/vehicles/get";
import TableComponent from "@/components/table";
import VehiclesTableComponent from "@/components/tableVehicles";
import { Card, CardContent } from "@/components/ui/card"
import { Tabs,TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function TablePage(){
    const [activeTab, setActiveTab] = useState("dealers");
    const { data: Vehicles, isLoading, error } = useQuery({
      queryKey: ["vehicles"],
      queryFn: () => getVehicles(),
    });
    const { data: dealersData, isLoading: dealersLoading, error: dealersError } = useQuery({
      queryKey: ["dealers"],
      queryFn: () => getDealers(),
    });
    const filteredVehicles = Vehicles?.map(item => {
      const { accidents, services, ...rest } = item;
      return rest;
    });
    if(isLoading ) return(    
       <div className="max-w-7xl mx-auto py-8">
          <div>Loading...</div>
        </div>
    );
    return(

    <div className="max-w-7xl mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dealers">Dealers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        </TabsList>
        <TabsContent value="dealers">
          {/* <div className="flex flex-row items-center py-6 gap-4"> */}
            {/* <Card className="p-6">
                <CardContent>
                  <h2 className="mb-2 text-2xl font-bold">Welcome to the Dashboard</h2>
                  <p className="text-muted-foreground">
                    This is your dashboard where you can monitor key metrics and performance indicators.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent>
                  <h2 className="mb-2 text-2xl font-bold">Welcome to the Dashboard</h2>
                  <p className="text-muted-foreground">
                    This is your dashboard where you can monitor key metrics and performance indicators.
                  </p>
                </CardContent>
              </Card><Card className="p-6">
                <CardContent>
                  <h2 className="mb-2 text-2xl font-bold">Welcome to the Dashboard</h2>
                  <p className="text-muted-foreground">
                    This is your dashboard where you can monitor key metrics and performance indicators.
                  </p>
                </CardContent>
              </Card> */}
            {/* </div> */}
          <TableComponent columns={dealersData ? Object.keys(dealersData[0] || {}).map(key => ({ accessorKey: key, header: key.charAt(0).toUpperCase() + key.slice(1).replace("_"," ") })) : []} data={dealersData ?? []}/>
        </TabsContent>
        <TabsContent value="vehicles">
          <VehiclesTableComponent columns={filteredVehicles ? Object.keys(filteredVehicles[0] || {}).map(key => ({ accessorKey: key, header: key.charAt(0).toUpperCase() + key.slice(1).replace("_"," ") })) : []} data={filteredVehicles ?? []}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}