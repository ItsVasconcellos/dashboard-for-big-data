"use client"
import TableComponent from "@/components/table";
import { Tabs,TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
export default function TablePage(){
    const [activeTab, setActiveTab] = useState("dealers");
    return(
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
)}