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
import BasicHome from "layouts/BasicHome";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
    flex: 1,
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
    valueGetter: (params: GridValueGetterParams) => params.row.contacts.name,
  },
  {
    field: "contactPhone",
    headerName: "",
    width: 150,
    valueGetter: (params: GridValueGetterParams) => params.row.contacts.phone,
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

const rows = [
  {
    id: 1,
    name: "Snow",
    phone: "123 456 447",
    contacts: {
      name: "Jon",
      phone: 14,
    },
  },
  {
    id: 2,
    name: "Lannister",
    phone: "123 456 447",
    contacts: {
      name: "Cersei",
      phone: 31,
    },
  },
  {
    id: 3,
    name: "Lannister",
    phone: "123 456 447",
    contacts: {
      name: "Jaime",
      phone: 31,
    },
  },
  {
    id: 4,
    name: "Stark",
    phone: "123 456 447",
    contacts: {
      name: "Arya",
      phone: 11,
    },
  },
  {
    id: 5,
    name: "Targaryen",
    phone: "123 456 447",
    contacts: {
      name: "Daenerys",
      phone: null,
    },
  },
  {
    id: 6,
    name: "Melisandre",
    phone: "123 456 447",
    contacts: {
      name: null,
      phone: 150,
    },
  },
];

const Pickers = () => {
  return (
    <BasicHome
      title="Pickers"
      subtitle="Add and view picker’s profile and information here."
      breadcumb={[
        { title: "Farm Name", href: "#" },
        { title: "Pickers", href: "" },
      ]}
      actions={<Button variant="contained">Add New Picker</Button>}
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

export default Pickers;
