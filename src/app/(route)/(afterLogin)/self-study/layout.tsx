export const metadata = {
  title: "자습교재 현황 ∙ 윈터스쿨",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="flex items-center gap-2 font-bold pl-1 sm:pl-3 sm:text-[16px]">자습교재 현황</h5>
      <div>{children}</div>
    </div>
  );
};

export default RootLayout;
