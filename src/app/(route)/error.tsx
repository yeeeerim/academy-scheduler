"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Result } from "antd";

// 임시 에러 페이지
export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col gap-4 justify-center items-center">
      <Result
        status="warning"
        title="There are some problems with your operation."
        extra={
          <Button
            type="primary"
            key="console"
            onClick={() => {
              document.cookie = "authToken=; Max-Age=0; path=/;";
              window.location.href = "/login";
            }}
          >
            로그인 페이지로 이동
          </Button>
        }
      />
    </div>
  );
}
