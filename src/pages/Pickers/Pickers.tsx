import {
  GridColDef,
  GridRenderCellParams,
  GridSortItem,
  GridValueGetterParams,
} from "@mui/x-data-grid"
import { FormattedDate, FormattedMessage, useIntl } from "react-intl"
import { useEffect, useState } from "react"
import EmptyPicker from "../../assets/icons/EmptyPicker.svg";
import BasicHome from "layouts/BasicHome";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import CreatePicker from "components/pickers/CreatePicker";
import { IPickerResponse } from "project-2-types/dist/interface";
import PickerDrawer from "components/pickers/PickerDrawer";
import SearchDataGrid from "components/SearchDataGrid";
import SortDataGrid from "components/SortDataGrid";
import UpdatePicker from "components/pickers/UpdatePicker";
import { getPickers } from "api/pickers";
import paths from "shared/paths";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import useQueryCache from "hooks/useQueryCache";
import { useUser } from "context/UserProvider";
import DataTable from "ui/DataTable";
import { useAlert } from "context/AlertProvider";
import { BodyText } from "ui/Typography";

const columns: GridColDef[] = [
  {
    field: "pickerList",
    renderHeader: () => (
      <FormattedMessage
        id="pickers.table.column.picker_list"
        defaultMessage="Picker List"
      />
    ),
    minWidth: 150,
    flex: 1,
    renderCell: (params) => {
      return (
        <Box>
          <BodyText size="md" fontWeight="Medium">
            {params.row.name}
          </BodyText>
          <BodyText size="xs" color="grey-500">
            {params.row.phone}
          </BodyText>
        </Box>
      );
    },
  },
  {
    field: "name",
    renderHeader: () => (
      <FormattedMessage id="pickers.table.column.name" defaultMessage="Name" />
    ),
    flex: 1,
    minWidth: 150,
    editable: true,
  },
  {
    field: "phone",
    renderHeader: () => (
      <FormattedMessage
        id="pickers.table.column.phone_number"
        defaultMessage="Phone Number"
      />
    ),
    sortable: false,
    width: 150,
  },
  {
    field: "contactName",
    renderHeader: () => (
      <FormattedMessage
        id="pickers.table.column.emergency_contact"
        defaultMessage="Emergency Contact"
      />
    ),
    width: 200,
    valueGetter: (params: GridValueGetterParams<IPickerResponse>) =>
      params.row.emergencyContact.name,
  },
  {
    field: "contactPhone",
    headerName: "",
    width: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: GridValueGetterParams<IPickerResponse>) =>
      params.row.emergencyContact.phone,
  },
  {
    field: "createdAt",
    headerName: "Created at",
    width: 200,
    valueGetter: (params: GridValueGetterParams<IPickerResponse>) =>
      params.row.createdAt,
    renderCell: (params: GridRenderCellParams<IPickerResponse>) => {
      return (
        <FormattedDate
          value={params.row.createdAt}
          year="numeric"
          month="long"
          day="numeric"
        />
      );
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
    renderCell: (data: GridRenderCellParams<IPickerResponse>) => {
      return <UpdatePicker pickerId={data.row._id} />;
    },
  },
];

const Pickers = () => {
  const params = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const openNew = searchParams.get("new");

  const intl = useIntl();
  const { user } = useUser();
  const { showAlert } = useAlert();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const { GET_QUERY_KEY } = useQueryCache("pickers");

  const [open, setOpen] = useState<boolean>(false);
  const [pickers, setPickers] = useState<Array<IPickerResponse>>([]);

  const [search, setSearch] = useState<string>();
  const [sortModel, setSortModel] = useState([
    {
      field: "createdAt",
      sort: "desc",
    },
  ]);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => {
    setOpen(false);
    window.location.replace(paths.pickers);
  };

  const { isLoading } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: getPickers,
    onSuccess: (results) => {
      setPickers(results);
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "pickers.get.pickers.error",
          defaultMessage: "No pickers found",
        }),
        "error"
      );
    },
  });

  useEffect(() => {
    if (params.id) {
      showDrawer();
    }
  }, [params.id]);

  useEffect(() => {
    if (openNew === "true") {
      showDrawer();
    }
  }, [openNew]);

  return (
    <BasicHome
      title={intl.formatMessage({ id: "pickers", defaultMessage: "Pickers" })}
      subtitle={intl.formatMessage({
        id: "pickers.subtitle",
        defaultMessage: "Add and view picker’s profile and information here.",
      })}
      breadcrumb={[
        { title: user.farm.name, href: "/" },
        {
          title: (
            <FormattedMessage id="sidebar.pickers" defaultMessage="Pickers" />
          ),
          href: "",
        },
      ]}
      actions={!!desktop && <CreatePicker />}
    >
      <Box display="flex" justifyContent="space-between">
        <SortDataGrid
          sortModel={sortModel[0]}
          setSortModel={setSortModel}
          options={[
            { field: "name", sort: "asc", label: "A to Z" },
            { field: "name", sort: "desc", label: "Z to A" },
            { field: "createdAt", sort: "desc", label: "Recently added" },
            { field: "createdAt", sort: "asc", label: "Long-standing" },
          ]}
        />
        {desktop ? (
          <SearchDataGrid applySearch={setSearch} />
        ) : (
          <CreatePicker />
        )}
      </Box>

      <Box display="flex" flexGrow={1}>
        <DataTable
          rows={pickers}
          columns={columns}
          loading={isLoading}
          initialState={{
            columns: {
              columnVisibilityModel: {
                name: !!desktop,
                phone: !!desktop,
                pickerList: !desktop,
                contactName: !!desktop,
                contactPhone: !!desktop,
                createdAt: !!desktop,
              },
            },
          }}
          emptyState={{
            image: EmptyPicker,
            title: intl.formatMessage({
              id: "pickers.empty.state.title",
              defaultMessage: `It seems  you haven't added any pickers yet.`,
            }),
            subtitle: intl.formatMessage({
              id: "pickers.empty.state.subtitle",
              defaultMessage: ` Let's add your first picker!`,
            }),
          }}
          filterModel={{
            items: [],
            quickFilterValues: search ? search?.split(" ") : [],
          }}
          sortModel={sortModel as Array<GridSortItem>}
          onSortModelChange={(model) => {
            setSortModel(model as any);
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {!!open && (
        <PickerDrawer pickerId={params.id} dismiss={hideDrawer} open />
        // Replace with Picker detail
      )}
    </BasicHome>
  );
};

export default Pickers
