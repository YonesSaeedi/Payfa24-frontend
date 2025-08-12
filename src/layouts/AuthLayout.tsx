interface AuthLayoutProps {
  image: string;
  children: React.ReactNode;
}

export default function AuthLayout({ image, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* layout =========================================================================================================== */}
      <div className="flex-1 bg-gray-100">
        auth layout
        <img src={image} alt="Auth Illustration" className="w-full h-full object-cover" />
      </div>
      {/* content =========================================================================================================== */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
