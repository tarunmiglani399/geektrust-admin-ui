import "./AdminTable.css";
import "antd/dist/antd.min.css";
import React, { useEffect, useState } from "react";
import { Table, Input, Form, Modal, notification, Spin, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../Constants";
import EditModal from "../Edit-Modal/EditModal";

const AdminTable = () => {
  const [userDataDisplay, setUserDataDisplay] = useState([]);
  const [fullUserData, setFullUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    searchData();
  }, [searchKey]);

  const showNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL);
      const data = response.data.map((item) => {
        var tempObject = Object.assign({}, item);
        tempObject.key = item.id;
        return tempObject;
      });
      setUserDataDisplay(data);
      setFullUserData(data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      showNotification("error", e.message);
    }
  };

  const searchData = () => {
    const updatedUserData = fullUserData.filter((item) => {
      return Object.keys(item).some((key) =>
        item[key].toLowerCase().startsWith(searchKey?.toLowerCase())
      );
    });
    setUserDataDisplay(updatedUserData);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      render: (_, user) => {
        return (
          <>
            <EditOutlined onClick={() => editUser(user)} />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => removeUserById(user.id)}
            />
          </>
        );
      },
    },
  ];

  const editUser = (user) => {
    form.setFieldsValue(user);
    setEditingUser(user);
    setIsEditing(true);
  };

  const removeUserById = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setFullUserData((prev) => {
          return prev.filter((user) => {
            return user.id !== id;
          });
        });
        setUserDataDisplay((prev) => {
          return prev.filter((user) => {
            return user.id !== id;
          });
        });
        showNotification("success", "User deleted successfully");
      },
    });
  };

  const removeSelectedRows = () => {
    if (!selectedUsers.length > 0) {
      showNotification("warning", "Select atleast one user!");
      return;
    }
    Modal.confirm({
      title: "Are you sure you want to delete the selected users?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setFullUserData((prev) => {
          return prev.filter((user) => {
            return !selectedUsers.includes(user.key);
          });
        });
        setUserDataDisplay((prev) => {
          return prev.filter((user) => {
            return !selectedUsers.includes(user.key);
          });
        });
        setSearchKey(null);
        setSelectedUsers([]);
        showNotification("success", "Selected users deleted successfully");
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Input.Search
            placeholder="Search by name, email or role"
            onChange={(e) => setSearchKey(e.target.value)}
            style={{ marginBottom: 5 }}
            allowClear
            enterButton
          />
          <Table
            columns={columns}
            dataSource={userDataDisplay}
            rowSelection={{
              onChange: (selectedRowKeys) => {
                setSelectedUsers(selectedRowKeys);
              },
            }}
            pagination={{
              current: currentPage,
              onChange: (page) => {
                setCurrentPage(page);
              },
            }}
          />
          <EditModal
            form={form}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            setFullUserData={setFullUserData}
            setUserDataDisplay={setUserDataDisplay}
          />
          <Button
            type="primary"
            danger
            className="delete-selected-btn"
            onClick={removeSelectedRows}
            style={{
              borderRadius: 12,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            Delete Selected
          </Button>
        </>
      )}
    </>
  );
};

export default AdminTable;
