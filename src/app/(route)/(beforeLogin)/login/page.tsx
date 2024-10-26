"use client";

import React, { useEffect, useRef, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

import data from "@/account/data.json";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  const isMount = useRef<boolean>(false);
  const [form] = Form.useForm();

  const userList = data;

  useEffect(() => {
    if (id.length > 0)
      form.setFieldsValue({ username: id, remember: id.length > 0 });
  }, [id, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const User = userList.find((user) => user.id === values.username);

    if (!User) {
      toast.error("아이디 혹은 비밀번호가 잘못되었습니다.");
      return;
    }

    if (values.username === User.id && values.password === User.password) {
      toast.success("로그인 성공");
      const now = new Date();
      now.setTime(now.getTime() + 30 * 60 * 1000); // 30분

      setCookie("authToken", User.sheetId, {
        expires: now,
      });
      localStorage.setItem("di_s", User.sheetId);
      localStorage.setItem("u_name", User.name);
      router.replace("/");

      // 아이디 정보 저장
      if (values.remember) {
        localStorage.setItem("u_id", User.id);
      } else {
        localStorage.removeItem("u_id");
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
    isMount.current = true;
  }, []);

  useEffect(() => {
    if (isMount.current) {
      const username = localStorage.getItem("u_id") || "";
      setId(username);
    }
  }, [isMount.current]);

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-[400px] max-w-[90vw]">
      <img className="h-[100px]" src="/images/logo/color_1.png" alt="logo" />
      <Form
        name="basic"
        form={form}
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        className="w-full [&_.ant-form-item-explain-error]:text-[11px] [&_.ant-form-item-explain-error]:mt-1"
        layout="vertical"
        initialValues={{ remember: id.length > 0, username: id }}
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

        <Form.Item<FieldType> name="remember" valuePropName="checked">
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
