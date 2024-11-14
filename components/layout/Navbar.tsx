"use client";

import { useAuth, UserButton } from "@clerk/nextjs";

import Container from "../Container";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

import SearchInput from "../SearchInput";

import { ModeToggle } from "../ModeToggle";
import { NavMenu } from "./NavMenu";

const Navbar = () => {
  const router = useRouter();

  const { userId } = useAuth();

  return (
    <header className="sticky top-0 border border-b-primary/10 bg-secondary z-50">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src="/icon.jpg" alt="logo" width={30} height={30} />
            <span className="font-bold text-xl">JayHotels</span>
          </div>

          <SearchInput />

          <div className="flex gap-3 items-center">
            <div>
              <ModeToggle />
              <NavMenu />
            </div>
            <UserButton />

            {!userId && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </Button>
                <Button size="sm" onClick={() => router.push("/sign-up")}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
