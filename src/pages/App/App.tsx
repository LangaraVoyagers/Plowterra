import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AlertProvider } from "context/AlertProvider";
import HarvestLogs from "pages/HarvestLogs"
import Home from "pages/Home";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MainLayout from "layouts/MainLayout";
import Payroll from "pages/Payroll";
import Pickers from "pages/Pickers";
import Preview from "pages/Preview";
import { ReactQueryDevtools } from "react-query/devtools";
import Seasons from "pages/Seasons";
import { UserProvider } from "context/UserProvider";
import paths from "shared/paths";
import PublicRoutes from "layouts/PublicRoutes";
import LogOut from "pages/LogOut";

const router = createBrowserRouter([
  {
    path: paths.login,
    element: <PublicRoutes />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: paths.logout,
        element: <LogOut />,
      },
      {
        path: paths.home,
        element: <Home />,
      },
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
      {
        path: paths.preview,
        element: <Preview />,
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
      <UserProvider>
        <AlertProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </AlertProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
