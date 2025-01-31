'use client';

import { Form, FormProps, Table } from 'antd';
import React, { useEffect } from 'react';

const AdminPage = () => {
  const [users, setUsers] = React.useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetch(`/api/users`).then((res) => {
        return res.json();
      });
      setUsers(data.users);
    };
    getUsers();
  }, []);

  type FieldType = {
    name?: string;
    password?: string;
    id?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    await fetch(`/api/users`, {
      method: 'POST',
      body: JSON.stringify(values),
    });
  };

  const data: FieldType[] = users
    ? users.map((user) => {
        return {
          key: user.id,
          name: user.name,
          id: user.id,
          role: user.role,
        };
      })
    : [];

  return (
    <div className="flex flex-col gap-6">
      <h2>사용자 등록</h2>
      <div className="border rounded-[4px] p-4">
        <Form onFinish={onFinish}>
          <Form.Item name="id" label="아이디">
            <input className="border rounded-sm" type="text" />
          </Form.Item>
          <Form.Item name="password" label="비밀번호">
            <input className="border rounded-sm" type="password" />
          </Form.Item>
          <Form.Item name="name" label="이름">
            <input className="border rounded-sm" type="text" />
          </Form.Item>
          <Form.Item>
            <button type="submit">등록</button>
          </Form.Item>
        </Form>
      </div>
      <h2>사용자 목록</h2>
      {users && (
        <Table<FieldType>
          columns={[
            { title: 'ID', dataIndex: 'id' },
            { title: 'NAME', dataIndex: 'name' },
            { title: 'ROLE', dataIndex: 'role' },
          ]}
          dataSource={data}
        />
      )}
    </div>
  );
};

export default AdminPage;
