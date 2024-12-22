/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/AxiosInstance";
import { FieldValues } from "react-hook-form";

export const addToCart = async (cartData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/carts", cartData);
    // console.log({ data });
    return data;
  } catch (error: any) {
    // console.log({error: error.response?.data});
    // if (error.response?.data?.error?.code != "504")
      throw new Error(error.response?.data?.message || "Failed to add to cart");
  }
};

export const getCart = async () => {
  try {
    const { data } = await axiosInstance.get(`/carts`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch cart");
  }
};

export const clearCart = async () => {
  try {
    const { data } = await axiosInstance.delete(`/carts`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to clear cart");
  }
};

export const removeFromCart = async (cartItemId: string) => {
  try {
    const { data } = await axiosInstance.delete(
      `/carts/cartItem/${cartItemId}`
    );
    // console.log({ data });
    return data;
  } catch (error: any) {
    // console.log({ error });
    throw new Error(
      error.response?.data?.message || "Failed to remove from cart"
    );
  }
};

export const updateCart = async (cartItemId: string, cartData: FieldValues) => {
  try {
    const { data } = await axiosInstance.put(
      `/carts/cartItem/${cartItemId}`,
      cartData
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update cart");
  }
};
