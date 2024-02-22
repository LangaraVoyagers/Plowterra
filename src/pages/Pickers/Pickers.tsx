import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { getPickers } from "api/pickers";
import PickerDrawer from "components/pickers/PickerDrawer";
import BasicHome from "layouts/BasicHome";
import { IPicker } from "project-2-types/lib/pickers";
import { useState } from "react";
import { useQuery } from "react-query";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
    editable: true,
  },
  {
    field: "phone",
    headerName: "Phone Number",
    width: 150,
  },
  {
    field: "contactName",
    headerName: "Emergency Contact",
    width: 200,
    valueGetter: (params: GridValueGetterParams<IPicker>) =>
      params.row.emergencyContact.name,
  },
  {
    field: "contactPhone",
    headerName: "",
    width: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams<IPicker>) =>
      params.row.emergencyContact.phone,
  },

  {
    field: "action",
    headerName: "",
    width: 150,
    renderCell: () => {
      return <Button>View More</Button>;
    },
  },
];

const Pickers = () => {
  const { isLoading } = useQuery({
    queryKey: ["pickers", "get"],
    queryFn: getPickers,
    onSuccess: (results) => {
      setPickers(results);
    },
  });

  const [pickers, setPickers] = useState<Array<IPicker>>([]);

  return (
    <BasicHome
      title="Pickers"
      subtitle="Add and view picker’s profile and information here."
      breadcrumb={[
        { title: "Farm Name", href: "#" },
        { title: "Pickers", href: "" },
      ]}
      actions={<PickerDrawer />}
    >
      <Box display="flex" justifyContent="space-between">
        <FormControl>
          <InputLabel id="sortby-label">Sort</InputLabel>

          <Select
            labelId="sortby-label"
            id="sortby-select"
            value={1}
            label="Sort:"
            size="small"
          >
            <MenuItem value={1}>Latest to Oldest</MenuItem>
            <MenuItem value={2}>Oldest to Latest</MenuItem>
            <MenuItem value={3}>A to Z</MenuItem>
            <MenuItem value={4}>Z to A</MenuItem>
          </Select>
        </FormControl>

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

      <Box display="flex" flexGrow={1}>
        <DataGrid
          rows={pickers}
          columns={columns}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          getRowId={(data) => data.id}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
        />
      </Box>
    </BasicHome>
  );
};

export default Pickers;
