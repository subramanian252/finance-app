"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

interface Props {}

function Welcome(props: Props) {
  const {} = props;

  const { user, isLoaded } = useUser();

  return (
    <div className="space-y-4 mb-4">
      <h2 className="text-2xl lg:text-4xl text-white font-semibold">
        Welcome back{isLoaded && ", "}
        {user?.firstName} 👋
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">
        This is your financial report for the year 2024
      </p>
    </div>
  );
}

export default Welcome;
