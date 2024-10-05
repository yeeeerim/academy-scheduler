export const metadata = {
  title: "로그인 ∙ 윈터스쿨",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen h-max flex items-center flex-col justify-center max-h-screen">
      {children}
    </div>
  );
};

export default RootLayout;
