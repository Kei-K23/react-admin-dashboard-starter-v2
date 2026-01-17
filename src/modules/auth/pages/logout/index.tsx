import { useEffect } from "react";
import { useLogout } from "../../hooks/use-auth";

export default function Logout() {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, [logout]);

  return <div>Logout...</div>;
}
