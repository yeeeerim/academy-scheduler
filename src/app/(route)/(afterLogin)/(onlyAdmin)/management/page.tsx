"use client";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { useState } from "react";

const page = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const actions: React.ReactNode[] = [
    <button type="button" onClick={() => {}}>
      로그인
    </button>,
  ];

  return (
    <div className="flex gap-4 w-full flex-wrap">
      <Card loading={loading} actions={actions} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title="Card title"
          description={
            <>
              <p>아이디 : giant1</p>
              <p>비밀번호 : O</p>
              <p>시트 연동 : O</p>
            </>
          }
        />
      </Card>
      <Card loading={loading} actions={actions} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title="Card title"
          description={
            <>
              <p>This is the description</p>
              <p>This is the description</p>
            </>
          }
        />
      </Card>
    </div>
  );
};

export default page;
