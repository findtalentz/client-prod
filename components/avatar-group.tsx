import React from "react";

interface CustomAvatarGroupProps {
  total: number;
  children: React.ReactNode;
}

export function CustomAvatarGroup({ total, children }: CustomAvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const surplus = total - avatars.length;

  return (
    <div className="flex -space-x-6 items-center">
      {avatars}
      {surplus > 0 && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700 border-2 border-white z-10">
          +{surplus.toString()[0]}k
        </span>
      )}
    </div>
  );
}
