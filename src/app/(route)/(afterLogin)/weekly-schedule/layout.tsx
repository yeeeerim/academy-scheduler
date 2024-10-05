export const metadata = {
  title: "주간시간표 ∙ 거인의발자국",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="flex items-center gap-2 font-bold pl-1 sm:pl-3 sm:text-[16px]">
        주간 시간표
      </h5>
      <div className="bg-white rounded-md p-0 sm:!rounded-none">{children}</div>
    </div>
  );
};

export default RootLayout;
