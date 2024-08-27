import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {}

function LogoButton(props: Props) {
  const {} = props;

  return (
    <Link href={"/"}>
      <div className="hidden lg:flex items-center gap-x-4">
        <Image
          src="./logoipsum-296.svg"
          alt="image"
          width={28}
          height={28}
          className="object-contain"
        />
        <p className="font-semibold text-white text-3xl ">Finance</p>
      </div>
    </Link>
  );
}

export default LogoButton;
