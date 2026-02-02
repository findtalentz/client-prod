"use client";
import Container from "@/components/ui/container";
import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

function Refer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const validatedData = formSchema.parse({ email });

      const res = await apiClient.post<ApiResponse<string>>("/refers", {
        refereeEmail: validatedData.email,
      });

      toast.success(res.data.message);
      setEmail("");
      setError("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        toast.error(err.errors[0].message);
      } else {
        if (err instanceof AxiosError && err.response) {
          toast.error(err.response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full h-dvh flex items-center justify-center">
        <div className="flex items-center justify-center flex-col space-y-4">
          <h1>Referrals</h1>
          <div className="md:w-[800px] w-full py-10 flex items-center justify-center bg-[url('/call_to_action_bg.png')] px-10 rounded-3xl bg-cover">
            <div className="text-center w-full space-y-2">
              <h2 className="text-[#E2F397]">Refer a friend Get $100.</h2>
              <p className="text-white">
                Invite your friends to Talentz, you get $100 when they create
                the first job adv
              </p>
              <div className="flex flex-col items-start w-full">
                <p className="text-white">Email</p>
                <div className="w-full rounded-e-3xl rounded-s-xl bg-white flex h-10 md:h-12 items-center justify-between overflow-hidden">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border-none focus:outline-none h-full ps-4"
                    placeholder="yourmail@example.com"
                  />
                  <button
                    disabled={loading}
                    onClick={onSubmit}
                    className="bg-[#AAEBCA] px-10 md:px-16 h-full"
                  >
                    {loading ? <BeatLoader /> : "Send"}
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
              </div>
            </div>
          </div>
          <Link
            className="text-primary-dark font-semibold underline"
            href="/profile"
          >
            Skip for Now
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default Refer;
