import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { Search } from "@mui/icons-material";
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

const rows = [
  {
    id: 1,
    name: "John Doe",
    product: "Cocoa",
    amount: "100kg",
    deductions: "$5",
    date: "12/12/2020",
  },
  {
    id: 2,
    name: "John Doe",
    product: "Cocoa",
    amount: "100kg",
    deductions: "$5",
    date: "12/12/2022",
  },
  {
    id: 3,
    name: "John Doe",
    product: "Cocoa",
    amount: "100kg",
    deductions: "$5",
    date: "12/12/2023",
  },
  {
    id: 4,
    name: "John Doe",
    product: "Cocoa",
    amount: "100kg",
    deductions: "$5",
    date: "12/12/2020",
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
                <Search />
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
      <Box>
        <DataGrid
          rows={rows}
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
