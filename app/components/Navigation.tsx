"use client";

import React, { useState } from "react";
import NaviagtionButton from "./NaviagtionButton";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {}

const routes = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

function Navigation(props: Props) {
  const {} = props;

  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant={"default"}
            size={"sm"}
            className=" font-normal bg-white/10 hover:text-white hover:bg-white/20 border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus:bg-white/30 transition"
            asChild
          >
            <div>
              <Menu className="size-5" />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="px-2">
          <SheetHeader>
            <SheetTitle className="w-full text-left px-4 font-semibold">
              Navigation
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-y-2 pt-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={"ghost"}
                onClick={() => {
                  setIsOpen(false);
                  router.push(route.href);
                }}
                className="justify-start w-full"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className=" hidden lg:flex items-center gap-x-2">
      {routes.map((route) => (
        <NaviagtionButton
          key={route.href}
          label={route.label}
          href={route.href}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
}

export default Navigation;
