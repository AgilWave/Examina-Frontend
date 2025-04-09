/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import { setviewUser } from "@/redux/features/UserSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getAdminByID( dispatch: any, id: any) {
  const jwt = Cookies.get("adminjwt");
  const headers = {
    Accept: "text/plain",
    Authorization: `Bearer ${jwt}`,
  };
  try {
    const response = await axios.get(
      `${BACKEND_URL}/users/${id}`,

      { headers }
    );
    if (response.data.isSuccessful) {
      if (dispatch !== null) {
        dispatch(setviewUser(response.data.content));
      } else {
        return response.data.content;
      }
    }
  } catch (err: any) {
    if (err.response) {
      if (err.response.status === 401) {
        LogoutAction();
      }
    }
  }
}
