import React from "react";
import Header from "@/app/components/Header";

interface Props {
  children: React.ReactNode;
}

function Layout(props: Props) {
  const { children } = props;

  return (
    <>
      <Header />
      <main className="px-3">{children}</main>
    </>
  );
}

export default Layout;
