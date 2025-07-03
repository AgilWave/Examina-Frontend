/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { LogoutAction } from "@/services/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function OverView() {
  const jwt = Cookies.get("adminjwt");
  const headers = {
    Accept: "text/plain",
    Authorization: `Bearer ${jwt}`,
  };

  try {
    const response = await axios.get(`${BACKEND_URL}/dashboard/overview`, {
      headers,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        "Failed to fetch dashboard overview"
      );
    }
  } catch (err: any) {
    // if (err.response?.status === 401) {
    //     LogoutAction();
    // }
    throw err;
  }
}
