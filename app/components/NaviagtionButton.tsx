import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface Props {
  label: string;
  href: string;
  isActive?: boolean;
}

function NaviagtionButton(props: Props) {
  const { label, href } = props;

  return (
    <Button
      variant={"ghost"}
      className={cn(
        "w-full lg:w-fit text-white hover:bg-white/20 border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0",
        {
          "bg-white/20": props.isActive,
        }
      )}
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export default NaviagtionButton;
