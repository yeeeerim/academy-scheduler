export const metadata = {
  title: "월간시간표 ∙ 윈터스쿨",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="flex items-center gap-2 font-bold pl-1 sm:pl-3 sm:text-[16px]">
        월간 시간표
      </h5>
      <div className="bg-white rounded-md p-6 sm:!rounded-none sm:py-3 sm:px-0">
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
