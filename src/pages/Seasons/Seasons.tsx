import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridSortItem,
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
import { ISeasonResponse, StatusEnum } from "project-2-types";
import FilterDataGrid from "components/FilterDataGrid";
import DataTable from "ui/DataTable";
import { BodyText } from "ui/Typography";
import { useAlert } from "context/AlertProvider";
import { Plant, Star } from "@phosphor-icons/react";
import { ColorPartial } from "@mui/material/styles/createPalette";

type StarIconProps = {
  id: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
};

const StarIcon = ({ id, checked, onChange }: StarIconProps) => {
  const theme = useTheme();
  return (
    <Star
      size={18}
      onClick={() => {
        onChange(id, !checked);
      }}
      color={
        checked
          ? (theme.palette.warning as ColorPartial)[400]
          : theme.palette.grey[500]
      }
      weight={checked ? "fill" : "regular"}
    />
  );
};
const columns = (
  defaultSeasonId: string,
  onDefaultSeasonChange: (id: string, checked: boolean) => void
): GridColDef[] => [
  {
    field: "default",
    headerName: "",
    width: 50,
    valueGetter: (params) => {
      return defaultSeasonId === params.row._id;
    },
    renderCell: (params) => {
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
          sx={{ cursor: "pointer" }}
        >
          {params?.row?.status === "ACTIVE" && (
            <StarIcon
              id={params.row._id}
              checked={params.value}
              onChange={onDefaultSeasonChange}
            />
          )}
        </Box>
      );
    },
  },
  {
    field: "name",
    renderHeader: () => (
      <FormattedMessage id="seasons.table.column.name" defaultMessage="Name" />
    ),
    flex: 0.25,
    minWidth: 100,
  },
  {
    field: "pickerList",
    renderHeader: () => (
      <FormattedMessage
        id="seasons.table.column.picker_list"
        defaultMessage="Picker List"
      />
    ),
    flex: 0.25,
    minWidth: 100,
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
    flex: 0.25,
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
    flex: 0.25,
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
    flex: 0.25,
  },
  {
    field: "endDate",
    renderHeader: () => (
      <FormattedMessage
        id="seasons.table.column.end_date"
        defaultMessage="End Date"
      />
    ),
    flex: 0.5,
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
      <FormattedMessage id="datagrid.column.actions" defaultMessage="Actions" />
    ),
    headerAlign: "center",
    align: "center",
    width: 150,
    flex: 0.15,
    disableColumnMenu: true,
    renderCell: (data: GridRenderCellParams<{ _id: string }>) => {
      return <UpdateSeason seasonId={data.row._id} />;
    },
  },
];

const Seasons = () => {
  const { user, defaultSeason, updateDefaultSeason } = useUser();
  const intl = useIntl();
  const { showAlert } = useAlert();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));

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
  const [sortModel, setSortModel] = useState<Array<GridSortItem>>([
    {
      field: "default",
      sort: "desc",
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
        { title: user.farm.name, href: "/" },
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
          columns={columns(defaultSeason, (id) => {
            if (id === defaultSeason) {
              updateDefaultSeason("");
            } else {
              updateDefaultSeason(id);
            }
          })}
          loading={isLoading}
          emptyState={{
            icon: <Plant width="100%" height="100%" />,
            title: intl.formatMessage({
              id: "seasons.empty.state.title",
              defaultMessage: `It seems  you haven't added any seasons yet.`,
            }),
            subtitle: intl.formatMessage({
              id: "seasons.empty.state.subtitle",
              defaultMessage: ` Let's add your first harvest season!`,
            }),
          }}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          initialState={{
            columns: {
              columnVisibilityModel: {
                name: !!tablet,
                status: !!tablet,
                product: !!tablet,
                startDate: !!tablet,
                endDate: !!tablet,
                pickerList: !tablet,
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
