import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { Outlet } from "react-router"

const RecaptchaWrapper = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      scriptProps={{ async: true, defer: true, appendTo: "head", nonce: undefined, }}
    >
      <Outlet />
    </GoogleReCaptchaProvider>
  )
}

export default RecaptchaWrapper