import { Box } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortItem,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { getPickers } from "api/pickers";
import PickerDrawer from "components/pickers/PickerDrawer";
import BasicHome from "layouts/BasicHome";
import { IPicker } from "project-2-types/lib/pickers";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import paths from "shared/paths";
import { useParams } from "react-router-dom";
import CreatePicker from "components/pickers/CreatePicker";
import UpdatePicker from "components/pickers/UpdatePicker";
import useQueryCache from "hooks/useQueryCache";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { useUser } from "context/UserProvider";
import SortDataGrid from "components/SortDataGrid";
import SearchDataGrid from "components/SearchDataGrid";

const columns: GridColDef[] = [
  {
    field: "name",
    renderHeader: () => (
      <FormattedMessage id="pickers.table.column.name" defaultMessage="Name" />
    ),
    width: 150,
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
    field: "createdAt",
    headerName: "Created at",
    width: 200,
    valueGetter: (params: GridValueGetterParams<IPicker>) =>
      params.row.createdAt,
    renderCell: (params: GridRenderCellParams<IPicker>) => {
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
    field: "action",
    headerName: "",
    width: 150,
    renderCell: (data: GridRenderCellParams<IPicker>) => {
      return <UpdatePicker pickerId={data.row._id} />;
    },
  },
];

const Pickers = () => {
  const params = useParams<{ id: string }>();
  const intl = useIntl();
  const { user } = useUser();
  const apiRef = useRef<any>(null);

  const { GET_QUERY_KEY } = useQueryCache("pickers");

  const [open, setOpen] = useState<boolean>(false);
  const [pickers, setPickers] = useState<Array<IPicker>>([]);

  const [search, setSearch] = useState<string>();
  const [sortModel, setSortModel] = useState([
    {
      field: "name",
      sort: "asc",
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
    },
  });

  useEffect(() => {
    if (params.id) {
      showDrawer();
    }
  }, [params.id]);

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
      actions={<CreatePicker />}
    >
      <Box display="flex" justifyContent="space-between">
        <SortDataGrid
          sortModel={sortModel[0]}
          setSortModel={setSortModel}
          options={[
            { field: "name", sort: "asc", label: "A to Z" },
            { field: "name", sort: "desc", label: "Z to A" },
            { field: "createdAt", sort: "desc", label: "Recently added first" },
            { field: "createdAt", sort: "asc", label: "Recently added last" },
          ]}
        />

        <SearchDataGrid applySearch={setSearch} />
      </Box>

      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid
          apiRef={apiRef}
          rows={pickers}
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
          sortModel={sortModel as Array<GridSortItem>}
          onSortModelChange={(model) => {
            setSortModel(model as any);
          }}
          getRowId={(data) => data?._id}
          pageSizeOptions={[10, 20, 50, 100]}
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

export default Pickers;
