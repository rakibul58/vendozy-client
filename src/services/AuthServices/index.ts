/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/AxiosInstance";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import envConfig from "@/config/envConfig";
import axios from "axios";

export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      const cookieStore = cookies();
      (await cookieStore).set("accessToken", data?.data?.accessToken);
      (await cookieStore).set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getNewAccessToken = async () => {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    const res = await axiosInstance({
      url: "/auth/refresh-token",
      method: "POST",
      withCredentials: true,
      headers: {
        cookie: `refreshToken=${refreshToken}`,
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error("Failed to get new access token", error);
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;

  let decodedToken = null;

  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);

    // console.log({ decodedToken });

    const { data } = await axiosInstance.get("/users/me");

    return {
      email: decodedToken.email,
      role: decodedToken.role,
      user: data.data,
    };
  }

  return decodedToken;
};

export const forgetPassword = async (payload: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/forget-password", payload);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const resetPassword = async (payload: FieldValues) => {
  try {
    console.log({payload});
    const { data } = await axios.post(
      `${envConfig.baseApi}/auth/reset-password`,
      payload.data,
      {
        headers: {
          Authorization: `${payload.token}`,
        },
      }
    );
    console.log({data});
    return data;
  } catch (error: any) {
    console.log({error});
    throw new Error(error.response);
  }
};

export const logout = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
};
