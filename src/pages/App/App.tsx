import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AlertProvider } from "context/AlertProvider";
import HarvestLogs from "pages/HarvestLogs"
import Login from "pages/Login";
import MainLayout from "layouts/MainLayout";
import Pickers from "pages/Pickers";
import { ReactQueryDevtools } from "react-query/devtools";
import Seasons from "pages/Seasons";
import paths from "shared/paths";
import Payroll from "pages/Payroll";

const router = createBrowserRouter([
  {
    path: paths.login,
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: paths.pickers,
        element: <Pickers />,
      },
      {
        path: `${paths.pickers}/:id`,
        element: <Pickers />,
      },
      {
        path: paths.seasons,
        element: <Seasons />,
      },
      {
        path: paths.harvestLogs,
        element: <HarvestLogs />,
      },
      {
        path: paths.payroll,
        element: <Payroll />,
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
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
