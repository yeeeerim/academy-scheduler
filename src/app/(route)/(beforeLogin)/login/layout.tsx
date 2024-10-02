const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen h-max flex items-center flex-col justify-center">
      {children}
    </div>
  );
};

export default RootLayout;
