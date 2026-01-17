import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { App as AntdApp } from "antd";
import { queryClient } from "./lib/react-query";
import { router } from "./router";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </QueryClientProvider>
  );
}
