"use client";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import toast from "react-hot-toast";

export default function SelectRole() {
  return (
    <Container className="md:min-h-[calc(100dvh-65px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-8 md:space-y-16">
        <Text
          variant="primary"
          className="text-center text-2xl md:text-3xl font-semibold mb-20"
        >
          Please Select Your Role
        </Text>

        <div className="flex items-center justify-center flex-col md:flex-row gap-26 md:gap-6">
          <RoleCard
            onClick={async () => {
              try {
                const { data } = await apiClient.post<ApiResponse<string>>(
                  "/auth/set-seller"
                );
                Cookies.set("token", data.data);
                window.location.href = "/dashboard";
              } catch (error) {
                if (error instanceof AxiosError) {
                  toast.error(error.message);
                }
              }
            }}
            title="Job Seeker"
            imageSrc="/signup_client.png"
            altText="Freelancer"
          />
          <RoleCard
            onClick={async () => {
              try {
                const { data } = await apiClient.post<ApiResponse<string>>(
                  "/auth/set-client"
                );
                Cookies.set("token", data.data);
                window.location.href = "/dashboard";
              } catch (error) {
                if (error instanceof AxiosError) {
                  toast.error(error.message);
                }
              }
            }}
            title="Employer"
            imageSrc="/signup_seller.png"
            altText="Client"
          />
        </div>
      </div>
    </Container>
  );
}

interface RoleCardProps {
  title: string;
  imageSrc: string;
  altText: string;
  onClick: () => void;
}

function RoleCard({ title, imageSrc, altText, onClick }: RoleCardProps) {
  return (
    <div onClick={onClick}>
      <div className="relative md:w-[350px] md:h-[350px] w-[250px] h-[230px] flex flex-col items-center ! justify-end rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
        <Image
          src={imageSrc}
          width={300}
          height={300}
          alt={altText}
          className="w-[200px] md:w-[300px] h-auto transition-all group-hover:scale-105 absolute -top-10"
        />

        <div className="w-full py-4 px-6 text-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}
