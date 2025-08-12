
import AuthLayout from "../layouts/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout image={forgotPasswordImage}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
