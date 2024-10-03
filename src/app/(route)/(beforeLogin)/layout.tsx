export const metadata = {
  title: "로그인 ∙ 거인의발자국",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen h-max flex items-center flex-col justify-center">
      {children}
    </div>
  );
};

export default RootLayout;
