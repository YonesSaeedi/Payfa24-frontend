import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { apiRequest } from "../utils/apiClient";
import IconGoogle from "../assets/icons/Login/IconGoogle";

interface GoogleTokenClient {
  requestAccessToken: () => void;
}
interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}
interface GoogleTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (tokenResponse: TokenResponse) => void;
}
interface GoogleOAuth2 {
  initTokenClient: (config: GoogleTokenClientConfig) => GoogleTokenClient;
}
interface GoogleIdentityServices {
  accounts: { oauth2: GoogleOAuth2 };
}
declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}
interface Response {
  status?: boolean;
  [key: string]: unknown;
}

export const GoogleLoginButton = ({ onSuccess }: { onSuccess: (data: Response) => void }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // لود کردن SDK گوگل
  const loadGoogleSDK = () => {
    if (window.google) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadGoogleSDK();
  }, []);

  const handleLogin = () => {
    if (!window.google || isLoading) return;

    setIsLoading(true);

    const enableCancelDetection = () => {
      const cancelLoading = () => {
        setIsLoading(false);
        document.removeEventListener("click", cancelLoading);
        window.removeEventListener("blur", cancelLoading);
        document.removeEventListener("visibilitychange", visibilityHandler);
      };

      const visibilityHandler = () => {
        if (document.visibilityState === "visible" && isLoading) {
          setTimeout(() => {
            if (isLoading) cancelLoading();
          }, 200);
        }
      };

      document.addEventListener("click", cancelLoading);
      window.addEventListener("blur", cancelLoading);
      document.addEventListener("visibilitychange", visibilityHandler);
    };

    setTimeout(enableCancelDetection, 100);

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid profile email",
      callback: async (tokenResponse: TokenResponse) => {
        document.removeEventListener("click", () => {});
        window.removeEventListener("blur", () => {});
        document.removeEventListener("visibilitychange", () => {});

        if (!tokenResponse?.access_token) {
          setIsLoading(false);
          return;
        }

        try {
          const recaptcha = executeRecaptcha ? await executeRecaptcha("google_login") : "";

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

          const response = await apiRequest<Response, any>({
            url: "/auth/google",
            method: "POST",
            data: { recaptcha, info_social },
          });

          if (response?.status) {
            onSuccess(response);
          }
        } catch (error) {
          console.error("خطا در ورود با گوگل:", error);
        } finally {
          setIsLoading(false);
        }
      },
    });

    tokenClient.requestAccessToken();
  };

  return (
    <div
      onClick={handleLogin}
      className={`
        flex border border-gray12 lg:rounded-xl rounded-lg w-full h-12 
        items-center justify-center gap-3 mt-4 mb-5 transition-all
        ${isLoading ? "cursor-not-allowed opacity-100" : "cursor-pointer"}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <span className="text-gray12 text-sm font-semibold">درحال ورود با اکانت گوگل ...</span>
        </div>
      ) : (
        <>
          <span className="icon-wrapper w-[22px] h-[22px]">
            <IconGoogle />
          </span>
          <span className="text-gray12 text-sm font-semibold">اکانت گوگل</span>
        </>
      )}
    </div>
  );
};
