import { Box, useMediaQuery, useTheme } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
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
import { ISeasonResponse, StatusEnum } from "project-2-types";
import FilterDataGrid from "components/FilterDataGrid";
import DataTable from "ui/DataTable";
import { BodyText } from "ui/Typography";
import { useAlert } from "context/AlertProvider";

const columns: GridColDef[] = [
  {
    field: "name",
    renderHeader: () => (
      <FormattedMessage id="seasons.table.column.name" defaultMessage="Name" />
    ),
    width: 250,
    flex: 1,
    minWidth: 250,
  },
  {
    field: "pickerList",
    renderHeader: () => (
      <FormattedMessage
        id="seasons.table.column.picker_list"
        defaultMessage="Picker List"
      />
    ),
    width: 250,
    flex: 1,
    minWidth: 250,
    renderCell: (params) => {
      return (
        <Box>
          <BodyText size="md" fontWeight="Medium">
            {params.row.name}
          </BodyText>
          <BodyText size="xs" color="grey-500">
            {<FormattedDate value={params.row.startDate} dateStyle="medium" />}{" "}
            -{" "}
            {params.row.endDate ? (
              <FormattedDate value={params.row.endDate} dateStyle="medium" />
            ) : (
              "Present"
            )}{" "}
            | {params.row.product?.name}
          </BodyText>
        </Box>
      );
    },
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
    valueGetter: (params) =>
      StatusEnum[params.row.status as keyof typeof StatusEnum],
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
    field: "actions",
    renderHeader: () => (
      <FormattedMessage id="table.column.actions" defaultMessage="Actions" />
    ),
    width: 150,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (data: GridRenderCellParams<{ _id: string }>) => {
      return <UpdateSeason seasonId={data.row._id} />;
    },
  },
];

const Seasons = () => {
  const { user } = useUser();
  const intl = useIntl();
  const { showAlert } = useAlert();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

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
      showAlert(
        intl.formatMessage({
          id: "seasons.get.seasons.error",
          defaultMessage: "No seasons found",
        }),
        "error"
      );
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
      actions={!!desktop && <CreateSeason />}
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
        {desktop ? (
          <SearchDataGrid applySearch={setSearch} />
        ) : (
          <CreateSeason />
        )}
      </Box>

      <Box display="flex" flexGrow={1} pb={3}>
        <DataTable
          rows={seasons}
          columns={columns}
          loading={isLoading}
          initialState={{
            columns: {
              columnVisibilityModel: {
                name: !!desktop,
                status: !!desktop,
                product: !!desktop,
                startDate: !!desktop,
                endDate: !!desktop,
                pickerList: !desktop,
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
          disableRowSelectionOnClick
        />
      </Box>
    </BasicHome>
  );
};

export default Seasons;
