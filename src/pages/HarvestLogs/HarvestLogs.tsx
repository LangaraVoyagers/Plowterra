import {
  Box,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IHarvestLog } from "project-2-types/lib/harvestLog";
import CreateHarvestLog from "components/harvestLogs/CreateHarvestLog";

import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";
import { getHarvestLogs } from "api/harvestLogs";

import BasicHome from "layouts/BasicHome";
import { useQuery } from "react-query";
import UpdateHarvestLog from "components/harvestLogs/UpdateHarvestLog";

const columns: GridColDef[] = [
  {
    field: "picker",
    headerName: "Name",
    width: 200,
    renderCell: (params: GridRenderCellParams<IHarvestLog>) =>
      params.value?.name || "",
  },
  {
    field: "season",
    headerName: "Product",
    width: 200,
    renderCell: (params: GridRenderCellParams<IHarvestLog>) =>
      params.value?.product?.name || "",
  },
  { field: "collectedAmount", headerName: "Amount", width: 200 },
  { field: "totalDeduction", headerName: "Deductions", width: 200 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 200,
    valueFormatter: (params) => {
      const date = new Date(params.value);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return formattedDate;
    },
  },
  {
    field: "action",
    headerName: "",
    width: 200,
    renderCell: (data: GridRenderCellParams<IHarvestLog & { _id: string }>) => {
      return <UpdateHarvestLog harvestLogId={data.row._id} />;
    },
  },
];

const HarvestLogs = () => {
  const { GET_QUERY_KEY } = useQueryCache("harvestLogs");

  const [harvestLogs, setHarvestLogs] = useState<Array<IHarvestLog>>([]);

  const { isLoading } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: getHarvestLogs,
    onSuccess: (results) => {
      setHarvestLogs(results);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <BasicHome
      title="Harvest Log"
      subtitle="Add and view picker’s daily collection data here."
      breadcrumb={[
        { title: "Farm Name", href: "#" },
        { title: "Harvest Log", href: "" },
      ]}
      actions={<CreateHarvestLog />}
    >
      <Box display="flex" justifyContent="space-between">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker label="Start Date" />
            <DatePicker label="End Date" />
          </DemoContainer>
        </LocalizationProvider>

        <FormControl>
          <OutlinedInput
            placeholder="Search"
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlass />
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid
          rows={harvestLogs}
          columns={columns}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
          }}
          getRowId={(data) => data?._id}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
        />
      </Box>
    </BasicHome>
  );
};

export default HarvestLogs;
