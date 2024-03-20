import { Box } from "@mui/material";
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
import { ISeasonResponse } from "project-2-types";
import FilterDataGrid from "components/FilterDataGrid";

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
    valueGetter: (params: GridValueGetterParams<ISeasonResponse>) =>
      params.row.startDate,
    renderCell: (params: GridRenderCellParams<ISeasonResponse>) => {
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
    valueGetter: (params: GridValueGetterParams<ISeasonResponse>) =>
      params.row.endDate,
    renderCell: (params: GridRenderCellParams<ISeasonResponse>) => {
      if (params.row.endDate) {
        return (
          <FormattedDate
            value={params.row.endDate}
            year="numeric"
            month="long"
            day="numeric"
          />
        );
      } else return "-";
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
  const [seasons, setSeasons] = useState<Array<ISeasonResponse>>([]);

  const [search, setSearch] = useState<string>();
  const [filterModel, setFilterModel] = useState([
    {
      field: "status",
      operator: "equals",
      value: "ACTIVE",
    },
  ]);

  const { isLoading } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: () => getSeasons(),
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
        <FilterDataGrid
          filterModel={filterModel[0]}
          setFilterModel={setFilterModel}
          options={[
            {
              field: "status",
              operator: "equals",
              value: "",
              label: "All",
            },
            {
              field: "status",
              operator: "equals",
              value: "ACTIVE",
              label: "Active",
            },
            {
              field: "status",
              operator: "equals",
              value: "Closed",
              label: "Closed",
            },
          ]}
        />

        <SearchDataGrid applySearch={setSearch} />
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
          filterModel={{
            items: [filterModel[0]],
            quickFilterValues: search ? search?.split(" ") : [],
          }}
          onFilterModelChange={(model) => {
            setFilterModel(model.items as any);
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
