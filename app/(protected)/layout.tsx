const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 min-h-screen min-w-max bg-gray-200">
      <main className="flex flex-1 p-8 min-h-screen">{children}</main>
    </div>
  );
};
export default LoginLayout;
