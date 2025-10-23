import { useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { apiRequest } from "../utils/apiClient";
import IconGoogle from "../assets/icons/Login/IconGoogle";

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const GoogleLoginButton = ({ onSuccess }: { onSuccess: (data: any) => void }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleLogin = () => {
    if (!window.google) return;

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid profile email",
      callback: async (tokenResponse: any) => {
        if (!tokenResponse?.access_token) return;

        const recaptcha = executeRecaptcha ? await executeRecaptcha("google_login") : "";

        // 🔹 گرفتن اطلاعات کاربر با access_token
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        const info_social = {
          Fa: userInfo.sub,
          Hc: tokenResponse,
          Dy: {
            Xba: userInfo.sub,
            Yg: userInfo.name,
            lda: userInfo.given_name,
            Cba: userInfo.family_name,
            Cz: userInfo.email,
            FV: userInfo.picture,
          },
          idpId: "google",
        };

        const response = await apiRequest({
          url: "/api/auth/google",
          method: "POST",
          data: { recaptcha, info_social },
        });

        if (response?.status) onSuccess(response);
      },
    });

    tokenClient.requestAccessToken();
  };


  return (
    <div
      className="flex border border-primary rounded-xl w-full h-12 items-center justify-center gap-2 mt-7 mb-5 cursor-pointer"
      onClick={handleLogin}
    >
      <span className="w-5 h-5">
        <IconGoogle />
      </span>
      <span className="text-black1 text-base font-semibold">اکانت گوگل</span>
    </div>
  );
};
