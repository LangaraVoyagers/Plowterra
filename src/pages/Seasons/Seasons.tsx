import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";

import BasicHome from "layouts/BasicHome";
import { getSeasons } from "api/seasons";
import { useQuery } from "react-query";
import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";
import { useUser } from "context/UserProvider";
import CreateSeason from "components/seasons/CreateSeason";
import UpdateSeason from "components/seasons/UpdateSeason";
import SearchDataGrid from "components/SearchDataGrid";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { ISeason } from "project-2-types";

const statuses = ["Active", "Closed"];

const columns: GridColDef[] = [
  {
    field: "name",
    renderHeader: () => (
      <FormattedMessage id="seasons.table.column.name" defaultMessage="Name" />
    ),
    width: 250,
    minWidth: 250,
  },
  {
    field: "status",
    renderHeader: () => (
      <FormattedMessage
        id="seasons.table.column.status"
        defaultMessage="Status"
      />
    ),
    width: 200,
  },
  {
    field: "product",
    renderHeader: () => (
      <FormattedMessage
        id="seasons.table.column.product"
        defaultMessage="Product"
      />
    ),
    width: 200,
    valueGetter: (params) => params.row.product?.name,
  },
  {
    field: "startDate",
    renderHeader: () => (
      <FormattedMessage
        id="seasons.table.column.start_date"
        defaultMessage="Start Date"
      />
    ),
    width: 150,
    valueGetter: (params: GridValueGetterParams<ISeason>) =>
      params.row.startDate,
    renderCell: (params: GridRenderCellParams<ISeason>) => {
      return (
        <FormattedDate
          value={params.row.startDate}
          year="numeric"
          month="long"
          day="numeric"
        />
      );
    },
  },
  {
    field: "endDate",
    renderHeader: () => (
      <FormattedMessage
        id="seasons.table.column.end_date"
        defaultMessage="End Date"
      />
    ),
    width: 150,
    // valueFormatter: (params) =>
    //   params?.value ? formatDate(params.value) : "-",
    valueGetter: (params: GridValueGetterParams<ISeason>) => params.row.endDate,
    renderCell: (params: GridRenderCellParams<ISeason>) => {
      if (!params?.row.endDate) return "-";
      else
        return (
          <FormattedDate
            value={params.row.endDate}
            year="numeric"
            month="long"
            day="numeric"
          />
        );
    },
  },
  {
    field: "action",
    headerName: "",
    width: 150,
    sortable: false,
    renderCell: (data: GridRenderCellParams<{ _id: string }>) => {
      return <UpdateSeason seasonId={data.row._id} />;
    },
  },
];

const Seasons = () => {
  const { user } = useUser();
  const intl = useIntl();

  const { GET_QUERY_KEY } = useQueryCache("seasons");
  const [seasons, setSeasons] = useState([]);

  const [search, setSearch] = useState<string>();
  const [filterStatus, setFilterStatus] = useState("Active");
  const [filteredRows, setFilteredRows] = useState(seasons);

  const handleFilterChange = (event: { target: { value: any } }) => {
    const value = event.target.value;
    setFilterStatus(value);
    if (value === "All") {
      setFilteredRows(seasons);
    } else {
      const filtered = seasons.filter(
        (row: { status: string }) => row.status === value
      );
      setFilteredRows(filtered);
    }
  };

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
      title={intl.formatMessage({
        id: "harvestSeason",
        defaultMessage: "Harvest Season",
      })}
      subtitle={intl.formatMessage({
        id: "harvestSeason.subtitle",
        defaultMessage: "Create and close your harvest season here.",
      })}
      breadcrumb={[
        { title: user.farm.name, href: "#" },
        {
          title: (
            <FormattedMessage
              id="sidebar.harvestSeason"
              defaultMessage="Harvest Season"
            />
          ),
          href: "",
        },
      ]}
      actions={<CreateSeason />}
    >
      <Box display="flex" justifyContent="space-between">
        <FormControl>
          <InputLabel id="filterby-label">Filter</InputLabel>

          <Select value={filterStatus} onChange={handleFilterChange}>
            <MenuItem value="All">All</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <SearchDataGrid applySearch={setSearch} />
      </Box>

      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
          }}
          filterModel={{
            items: [],
            quickFilterValues: search ? search?.split(" ") : [],
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
