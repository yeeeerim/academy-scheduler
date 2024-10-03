"use client";

import React, { useEffect } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const User = {
  id: "123",
  pw: "123",
  name: "123",
  sheet_id: "1xwR133yh4OEcx3zfhdRUkzd6Tfy95aX2yIyAhoEs2PE",
};

const LoginPage = () => {
  const router = useRouter();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    // console.log("Success:", values);
    if (values.username === User.id && values.password === User.pw) {
      toast.success("로그인 성공");
      setCookie("authToken", User.sheet_id);
      localStorage.setItem("di_s", User.sheet_id);
      localStorage.setItem("u_name", User.name);
      router.replace("/");
      if (values.remember) {
        localStorage.setItem("u_id", User.id);
      }
    } else {
      toast.error("아이디 혹은 비밀번호가 잘못되었습니다.");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-[400px] max-w-[90vw]">
      <img className="h-[100px]" src="/images/logo/color_1.png" alt="logo" />
      <Form
        name="basic"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        className="w-full [&_.ant-form-item-explain-error]:text-[11px] [&_.ant-form-item-explain-error]:mt-1"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="아이디"
          name="username"
          rules={[{ required: true, message: "아이디를 입력해주세요." }]}
        >
          <Input
            placeholder="아이디 입력"
            size="large"
            className="!rounded-none"
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
        >
          <Input.Password
            placeholder="비밀번호 입력 (8자리)"
            size="large"
            className="!rounded-none"
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          // wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>아이디 정보 저장</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            className="w-full"
            type="primary"
            htmlType="submit"
          >
            로그인
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
