import { Card, Table, Space, Tag, Typography, Avatar, Button } from "antd";
import { ReloadOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetAllAuditLogs } from "../../hooks/use-auth";
import type { ColumnsType } from "antd/es/table";
import type { AuditLog } from "../../services/auth.service";
import { formatDate } from "../../../../lib/date-utils";

const { Text } = Typography;

export default function ActivityLogs() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = {
    page: page.toString(),
    limit: limit.toString(),
    isActivityLog: true,
  };

  const {
    data: logsData,
    isLoading,
    refetch,
  } = useGetAllAuditLogs(params)(params);

  const columns: ColumnsType<AuditLog> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar src={record?.user?.profileImageUrl} icon={<UserOutlined />} />
          <div className="flex flex-col">
            <span className="font-medium">
              {record?.user?.fullName || "System/Unknown"}
            </span>
            <span className="text-xs text-gray-500">
              {record?.user?.email || "N/A"}
            </span>
          </div>
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => (
        <Tag color="purple" className="uppercase">
          {action}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (ip) => <Text code>{ip}</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
  ];

  return (
    <Card
      style={{ border: "none" }}
      styles={{ header: { padding: "20px 0" }, body: { padding: "20px 0" } }}
      title="Activity Logs"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={logsData?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: logsData?.meta?.total || 0,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} logs`,
        }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
}
