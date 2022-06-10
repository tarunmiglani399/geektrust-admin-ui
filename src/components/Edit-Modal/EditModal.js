import "antd/dist/antd.min.css";
import React from "react";
import { Input, Form, Modal, Button, Select, notification } from "antd";

const { Option } = Select;

const EditModal = ({
  form,
  isEditing,
  setIsEditing,
  editingUser,
  setEditingUser,
  setFullUserData,
  setUserDataDisplay,
}) => {
  const showNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  const onFieldChange = (e) => {
    setEditingUser((prev) => {
      return { ...prev, [`${e.target.name}`]: e.target.value };
    });
  };

  const onRoleFieldChange = (value) => {
    setEditingUser((prev) => {
      return { ...prev, role: value };
    });
  };

  const onFinish = () => {
    setFullUserData((prev) => {
      return prev.map((user) => {
        if (user.id === editingUser.id) {
          return editingUser;
        }
        return user;
      });
    });
    setUserDataDisplay((prev) => {
      return prev.map((user) => {
        if (user.id === editingUser.id) {
          return editingUser;
        }
        return user;
      });
    });
    setIsEditing(false);
    setEditingUser(null);
    showNotification("success", "User record updated successfully!")
  };

  return (
    <Modal
      title="Edit User"
      visible={isEditing}
      footer={null}
      onCancel={() => {
        setIsEditing(false);
        setEditingUser(null);
      }}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input onChange={onFieldChange} name="name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input correct email!",
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            },
          ]}
        >
          <Input onChange={onFieldChange} name="email" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[
            {
              required: true,
              message: "Please select a role!",
            },
          ]}
        >
          <Select placeholder="Select a role" onChange={onRoleFieldChange}>
            <Option value="member">Member</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            htmlType="button"
            style={{ marginRight: 10 }}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
