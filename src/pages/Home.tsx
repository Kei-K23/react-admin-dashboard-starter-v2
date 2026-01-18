import { Typography } from "antd";
import { useProfile } from "../modules/auth/hooks/use-auth";
import { useEffect } from "react";
const { Text } = Typography;

export default function Home() {
  const { refetch } = useProfile();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div>
      <Text>Dashboard</Text>
    </div>
  );
}
