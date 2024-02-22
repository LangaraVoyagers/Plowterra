import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Login from "pages/login";
import MainLayout from "layouts/MainLayout";
import paths from "shared/paths";
import Pickers from "pages/pickers";
import HarvestLogs from "pages/harvest-logs";  

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: paths.pickers.dashboard,
        element: <Pickers />,
      },
      {
        path: paths.harvestLogs.dashboard,
        element: <HarvestLogs />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
