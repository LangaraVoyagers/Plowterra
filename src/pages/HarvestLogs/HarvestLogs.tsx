import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { MagnifyingGlass  } from "@phosphor-icons/react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import BasicHome from "layouts/BasicHome";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "product", headerName: "Product", width: 200 },
  { field: "amount", headerName: "Amount", width: 200 },
  { field: "deductions", headerName: "Deductions", width: 200 },
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
          rows={[]} //TODO: replace with data from useQuery
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          getRowId={(data) => data.id}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </Box>
    </BasicHome>
  );
};

export default HarvestLogs;
