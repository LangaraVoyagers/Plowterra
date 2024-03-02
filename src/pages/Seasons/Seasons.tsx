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
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";

import BasicHome from "layouts/BasicHome";
import { MagnifyingGlass } from "@phosphor-icons/react";
import formatDate from "shared/formatDate";
import { getSeasons } from "api/seasons";
import { useQuery } from "react-query";
import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
  },
  {
    field: "product",
    headerName: "Product",
    width: 200,
    valueGetter: (params) =>
      params.row.product?.name,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 150,
    valueFormatter: (params) => 
      params?.value ? formatDate(params.value) : "-"
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
    valueFormatter: (params) => 
      params?.value ? formatDate(params.value) : "-"
  },
  {
    field: "action",
    headerName: "",
    width: 150,
    sortable: false,
    renderCell: () => <Button>View More</Button>,
  },
];

const Seasons = () => {
  const { GET_QUERY_KEY } = useQueryCache("seasons");
  const [seasons, setSeasons] = useState([]);

  const { isLoading } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: getSeasons,
    onSuccess: (results) => {
      setSeasons(results);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <BasicHome
      title="Harvest Season"
      subtitle="Create and close your harvest season here."
      breadcrumb={[
        { title: "Farm Name", href: "#" },
        { title: "Harvest Seasons", href: "" },
      ]}
      actions={<Button variant="contained">Add New Season</Button>}>
      <Box display="flex" justifyContent="space-between">
        <FormControl>
          <InputLabel id="filterby-label">Filter</InputLabel>

          <Select
            labelId="filterby-label"
            id="filterby-select"
            value={2}
            label="Filter:"
            size="small"
          >
            <MenuItem value={1}>All</MenuItem>
            <MenuItem value={2}>Active</MenuItem>
            <MenuItem value={3}>Closed</MenuItem>
          </Select>
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
          rows={seasons}
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

export default Seasons;
