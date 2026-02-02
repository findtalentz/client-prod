"use client";
import { FaFacebook } from "react-icons/fa6";

function FacebookLogin() {
  const login = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_DATABASE_URL}/auth/facebook`;
  };
  return (
    <div
      onClick={() => login()}
      className="flex-1 py-3 flex items-center justify-center border border-primary text-2xl rounded-md"
    >
      <FaFacebook className="text-blue-500" />
    </div>
  );
}

export default FacebookLogin;
