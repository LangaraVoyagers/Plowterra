import { Box, FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import {
  IHarvestLog,
  IHarvestLogResponse,
} from "project-2-types/dist/interface";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BasicHome from "layouts/BasicHome";
import CreateHarvestLog from "components/harvestLogs/CreateHarvestLog";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MagnifyingGlass } from "@phosphor-icons/react";
import UpdateHarvestLog from "components/harvestLogs/UpdateHarvestLog";
import { getHarvestLogs } from "api/harvestLogs";
import { useQuery } from "react-query";
import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";
import { useUser } from "context/UserProvider";

const columns: GridColDef[] = [
  {
    field: "picker",
    renderHeader: () => "Picker",
    width: 200,
    valueGetter: (params: GridValueGetterParams<IHarvestLogResponse>) =>
      params.row.picker?.name,
  },
  {
    field: "season",
    renderHeader: () => "Product",
    width: 200,
    valueGetter: (params: GridValueGetterParams<IHarvestLogResponse>) =>
      params.row.season?.product?.name,
  },
  { field: "collectedAmount", headerName: "Amount", width: 200 },
  { field: "totalDeduction", headerName: "Deductions", width: 200 },
  {
    field: "createdAt",
    renderHeader: () => "Date",
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
  const { user } = useUser();

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

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  return (
    <BasicHome
      title="Harvest Log"
      subtitle="Add and view picker’s daily collection data here."
      breadcrumb={[
        { title: user.farm.name, href: "#" },
        { title: "Harvest Log", href: "" },
      ]}
      actions={<CreateHarvestLog />}
    >
      <Box display="flex" justifyContent="space-between">
        <FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
                // console.log(newValue);
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
                // console.log(newValue);
              }}
            />
          </LocalizationProvider>
        </FormControl>

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
