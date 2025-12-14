"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"

export default function Home() {

  return (
    <div className="flex min-h-screen w-full flex-col p-8">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
         <Link href="/dashboard">Go to Dashboard</Link>
        </TabsContent>
        <TabsContent value="table">
          Password settings go here.
        </TabsContent>
      </Tabs>
    </div>
  );
}
