/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import { setViewCourse } from "@/redux/features/CourseSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getCourseByID( dispatch: any, id: any) {
  const jwt = Cookies.get("adminjwt");
  const headers = {
    Accept: "text/plain",
    Authorization: `Bearer ${jwt}`,
  };
  try {
    const response = await axios.get(
      `${BACKEND_URL}/course/${id}`,

      { headers }
    );
    if (response.data.isSuccessful) {
      if (dispatch !== null) {
        
        dispatch(setViewCourse(response.data.content));
      } else {
        console.log(response.data.content);
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
