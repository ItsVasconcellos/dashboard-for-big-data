"use client"
import TableComponent from "@/components/table";
import { Tabs,TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export default function Table(){
  const [activeTab, setActiveTab] = useState("dealers");

  // useEffect(() => {
  //     console.log("Active Tab:", activeTab);
  //   }, [activeTab]);

  return(
    <div className="max-w-7xl mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dealers">Dealers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        </TabsList>
        <TabsContent value="dealers">
          <TableComponent columns={[]} data={[]}/>
        </TabsContent>
        <TabsContent value="vehicles">
          <TableComponent columns={[]} data={[]}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}