"use client";

import DataChart from "../components/DataChart";
// import { helloworld } from "@/lib/utils";
import DataGrid from "../components/DataGrid";
export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataChart />
    </div>
  );
}
