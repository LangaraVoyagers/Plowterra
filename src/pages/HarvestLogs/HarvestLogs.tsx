import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IHarvestLog } from "project-2-types/lib/harvestLog";

import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";
import { getHarvestLogs } from "api/harvestLogs";

import BasicHome from "layouts/BasicHome";
import { useQuery } from "react-query";

const columns: GridColDef[] = [
  { field: "picker", headerName: "Name", width: 200 },
  { field: "product", headerName: "Product", width: 200 },
  { field: "collectedAmount", headerName: "Amount", width: 200 },
  { field: "totalDeduction", headerName: "Deductions", width: 200 },
  { field: "date", headerName: "Date", width: 200 },
  {
    field: "action",
    headerName: "",
    width: 200,
    renderCell() {
      return <Button>View More</Button>;
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
      console.log(results);
      
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
      actions={<Button variant="contained">Add New Log</Button>}
    >
      <Box display="flex" justifyContent="space-between">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker label="Basic date picker" />
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
      <Box>
        <DataGrid
          rows={harvestLogs}
          columns={columns}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          getRowId={(data) => data?._id}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </Box>
    </BasicHome>
  );
};

export default HarvestLogs;
