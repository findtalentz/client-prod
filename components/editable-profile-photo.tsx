"use client";
import UpdateProfileImage from "@/app/[lang]/profile/_components/update-profile-image";
import useSession from "@/hooks/useSession";
import { Avatar, Flex } from "@radix-ui/themes";

export default function EditableProfilePhoto() {
  const { data: user } = useSession();
  if (!user) return null;
  return (
    <div className="flex items-center justify-center relative max-w-min my-4">
      <Flex align="center" justify="center" className="relative">
        <Avatar radius="full" size="9" src={user.data.image} fallback="user" />
        <div className="absolute bottom-0  right-2">
          <UpdateProfileImage />
        </div>
      </Flex>
    </div>
  );
}
