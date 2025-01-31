import React, { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
  return <div className="bg-white p-10 min-h-screen">{children}</div>;
};

export default layout;
