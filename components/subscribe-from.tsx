"use client";

import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { joiResolver } from "@hookform/resolvers/joi";
import { AxiosError } from "axios";
import Joi from "joi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface Props {
  text: string;
}

const FormSchema = Joi.object({
  email: Joi.string().email().required(),
});

function SubscribeFrom({ text }: Props) {
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: joiResolver(FormSchema),
  });
  return (
    <div>
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            const response = await apiClient.post<ApiResponse<string>>(
              "/subscribes",
              data
            );
            toast.success(response.data.message);
            reset();
          } catch (error) {
            if (error instanceof AxiosError) {
              toast.error(error.message);
            }
          } finally {
            reset();
          }
        })}
        className="flex items-center justify-between h-[45px] border border-primary-light p-1 rounded-full w-full"
      >
        <input
          {...register("email")}
          placeholder="Fill in your email"
          className="flex-1 h-full border-none focus:outline-none px-2 max-w-[190px] text-white"
        />

        <Button type="submit" variant="light">
          {formState.isLoading ? "Subscribing" : text}
        </Button>
      </form>
      {formState.errors && formState.errors.email && (
        <span className="text-sm text-red-500">
          {formState.errors.email.message}
        </span>
      )}
    </div>
  );
}

export default SubscribeFrom;
