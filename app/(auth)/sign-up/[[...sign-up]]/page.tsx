import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full flex lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4s pt-16">
          <h1 className="text-3xl font-bold text-[#2e2a47]">Welcome back!</h1>
          <p className="text-base text-[#7e8ca0] mt-2">
            Log in or create your account to get started
          </p>
        </div>
        <div className="flex items-center justify-center mt-4">
          <ClerkLoaded>
            <SignUp path="/sign-up" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
        <Image
          src="./logoipsum-296.svg"
          alt="image"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
    </div>
  );
}
