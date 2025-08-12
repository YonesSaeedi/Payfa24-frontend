
import AuthLayout from "../layouts/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout image={registerImage}>
      <RegisterForm />
    </AuthLayout>
  );
}
