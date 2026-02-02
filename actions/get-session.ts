"use server";

import ApiResponse from "@/schemas/ApiRespose";
import User from "@/schemas/User";
import apiClient from "@/services/api-client";

export default async function getSession(): Promise<User | null> {
  try {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data ? data.data : null;
  } catch (error) {
    return null;
  }
}
