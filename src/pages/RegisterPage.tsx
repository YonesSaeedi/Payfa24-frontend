
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "./LoginPage";
// import registerImage from "../assets/registerImage.png"; // مسیر عکس واقعی

export default function RegisterPage() {
  return (
    <AuthLayout image={registerImage}>
      <LoginPage />
    </AuthLayout>
  );
}
