"use client";
import { FcGoogle } from "react-icons/fc";

function GoogleLogin() {
  const login = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_DATABASE_URL}/auth/google`;
  };
  return (
    <button
      onClick={() => login()}
      className="flex-1 py-3 flex items-center justify-center border border-primary text-2xl rounded-md hover:bg-gray-50 transition-colors duration-200"
      type="button"
    >
      <FcGoogle className="mr-2" />
    </button>
  );
}

export default GoogleLogin;
