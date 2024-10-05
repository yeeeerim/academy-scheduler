export const metadata = {
  title: "출결정보 ∙ 거인의발자국",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="flex items-center gap-2 font-bold pl-1 sm:pl-3 sm:text-[16px]">
        출결정보
      </h5>
      <div className="bg-white rounded-md p-6 sm:!rounded-none sm:p-3">
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
