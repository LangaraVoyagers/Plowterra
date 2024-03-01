import { MagnifyingGlass  } from "@phosphor-icons/react";
import {
  Box,
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
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { getPickers } from "api/pickers";
import PickerDrawer from "components/pickers/PickerDrawer";
import BasicHome from "layouts/BasicHome";
import { IPicker } from "project-2-types/lib/pickers";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import paths from "shared/paths";
import { useParams } from "react-router-dom";
import CreatePicker from "components/pickers/CreatePicker";
import UpdatePicker from "components/pickers/UpdatePicker";
import useQueryCache from "hooks/useQueryCache";
import { FormattedMessage, useIntl } from "react-intl";

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
    field: "action",
    headerName: "",
    width: 150,
    renderCell: (data: GridRenderCellParams<IPicker>) => {
      return <UpdatePicker pickerId={data.row.id} />;
    },
  },
];

const Pickers = () => {
  const params = useParams<{ id: string }>();
  const intl = useIntl();
  const { GET_QUERY_KEY } = useQueryCache("pickers");

  const [open, setOpen] = useState<boolean>(false);
  const [pickers, setPickers] = useState<Array<IPicker>>([]);

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
        { title: "Farm Name", href: "/" },
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
            placeholder={intl.formatMessage({
              id: "search",
              defaultMessage: "Search",
            })}
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
          getRowId={(data) => data?.id}
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
