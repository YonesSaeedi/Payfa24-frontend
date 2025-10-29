import { useEffect } from "react";
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
  accounts: {
    oauth2: GoogleOAuth2;
  };
}
declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}
interface Response {
  status?: boolean
  [key: string]: unknown
}

export const GoogleLoginButton = ({ onSuccess }: { onSuccess: (data: Response) => void }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  // Loads Google Identity Services SDK dynamically if not already loaded.           ===============================================================================
  // This ensures `window.google` is available before initializing the token client. ===============================================================================
  const loadGoogleSDK = () => {
    if (window.google) return;
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }
  useEffect(loadGoogleSDK, []);
  // handle login ===================================================================================================================================================
  const handleLogin = () => {
    if (!window.google) return;
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid profile email",
      callback: async (tokenResponse: TokenResponse) => {
        if (!tokenResponse?.access_token) return;
        const recaptcha = executeRecaptcha ? await executeRecaptcha("google_login") : "";
        // fetch user data using access token ================================
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
        const response = await apiRequest<Response, any>({ url: "/api/auth/google", method: "POST", data: { recaptcha, info_social }, });
        if (response?.status) onSuccess(response);
      },
    });
    tokenClient.requestAccessToken();
  };

  return (
    <div className="flex border border-primary rounded-xl w-full h-12 items-center justify-center gap-2 mt-7 mb-5 cursor-pointer" onClick={handleLogin}>
      <span className="w-5 h-5"><IconGoogle /></span>
      <span className="text-black1 text-base font-semibold">اکانت گوگل</span>
    </div>
  );
};
