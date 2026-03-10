"use client";
import UpdateCoverPhoto from "@/app/[lang]/profile/_components/update-cover-photo";
import useSession from "@/hooks/useSession";
import NextImage from "next/image";

export default function EditableCoverPhoto() {
  const { data: user } = useSession();
  if (!user) return null;
  return (
    <div className="relative w-full aspect-[1546/423] rounded-2xl overflow-hidden bg-gradient-to-r from-primary/20 to-primary/5 mb-4">
      {user.data.coverPhoto ? (
        <NextImage
          src={user.data.coverPhoto}
          alt="Cover"
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
      )}
      <UpdateCoverPhoto />
    </div>
  );
}
