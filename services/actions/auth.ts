"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";

export async function loginActionMS({ idToken }: { idToken: string }) {
  const cookieStore = await cookies();

  try {
    const res = await fetch(`${process.env.AUTH_BACKEND_URL}/auth/microsoft`, {
      method: "POST",
      body: JSON.stringify({
        token: idToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", res);

    if (res.status === 401) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: res.status }
      );
    }

    if (res.status !== 200 && res.status !== 201) {
      return NextResponse.json(
        {
          error: "Failed to login",
        },
        { status: res.status }
      );
    }

    const responseBody = await res.json();
    if (responseBody.error) {
      throw new Error(responseBody.error);
    }
    if (responseBody.jwt) {
      cookieStore.set("jwt", responseBody.jwt);
      const origin = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const redirectUrl = `${origin}/dashboard`;
      NextResponse.redirect(redirectUrl);
    }

    return {
      status: res.status,
    };
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("An error occurred during login");
  }
}
export async function LogoutAction() {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${process.env.AUTH_BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookieStore.get("jwt")?.value}`,
      },
    });

    if (res.status !== 200 && res.status !== 201) {
      const errorData = await res.json();
      throw new Error(
        `Failed to logout: ${errorData.message || res.statusText}`
      );
    }

    const responseData = await res.json();
    cookieStore.delete("jwt");
    return responseData;
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout");
  }
}

export async function LoginAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const cookieStore = await cookies();
  try {
    const res = await fetch(
      `${process.env.AUTH_BACKEND_URL}/auth/admin-login`,
      {
        method: "POST",
        body: JSON.stringify({
          username: email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseBody = await res.json();

    if (!responseBody.isSuccessful) {
      return {
        success: false,
        message: responseBody.message || "Login failed",
        status: res.status,
      };
    }

    if (responseBody.content.token && responseBody.content.user) {
      cookieStore.set("adminjwt", responseBody.content.token);
      const userDetails = JSON.stringify(responseBody.content.user);
      const encryptedUserDetails = encrypt(userDetails);
      cookieStore.set("userDetails", encryptedUserDetails)
      const origin = process.env.NEXT_Admin_PUBLIC_URL || "http://localhost:3000";
      let redirectUrl = `${origin}/admin/dashboard/overview`;

      if (responseBody.content.user.isFirstLogin) {
        redirectUrl = `${origin}/admin/login/changePassword`;
      }

      return {
        success: true,
        message: "Login successful",
        redirect: redirectUrl,
      };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: "An error occurred in login",
      status: 500,
    };
  }
}
