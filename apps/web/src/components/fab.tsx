"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Computer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { FaSignOutAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";

import { authClient } from "~/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function FAB() {
  // auth stuff
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  // theme stuff
  const { theme, setTheme } = useTheme();
  const handleThemeToggle = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "system";
      return "light";
    });
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 flex items-center justify-center p-4">
      {session.user.image && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-12 select-none">
              <AvatarImage src={session.user.image} />
              <AvatarFallback>{session.user.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36" align="start">
            <DropdownMenuGroup>
              <Link href="/settings">
                <DropdownMenuItem className="justify-between">
                  Settings <FiSettings />
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="justify-between"
              >
                Sign out <FaSignOutAlt />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleThemeToggle}
                className="justify-between"
              >
                Theme
                {theme === "light" ? (
                  <Sun />
                ) : theme === "dark" ? (
                  <Moon />
                ) : (
                  <Computer />
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
