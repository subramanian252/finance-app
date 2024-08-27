import React from "react";
import LogoButton from "./LogoButton";
import Navigation from "./Navigation";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Welcome from "./Welcome";
import Filters from "./Filters";

interface Props {}

function Header(props: Props) {
  const {} = props;

  return (
    <div className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 pb-36 lg:px-14">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center gap-x-6">
            <LogoButton />
            <Navigation />
          </div>
          <div>
            <ClerkLoaded>
              <UserButton />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin text-white" />
            </ClerkLoading>
          </div>
        </div>
        <Welcome />
        <Filters />
      </div>
    </div>
  );
}

export default Header;
