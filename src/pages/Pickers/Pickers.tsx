import {
  GridColDef,
  GridRenderCellParams,
  GridSortItem,
  GridValueGetterParams,
} from "@mui/x-data-grid"
import { FormattedDate, FormattedMessage, useIntl } from "react-intl"
import { useEffect, useState } from "react"

import BasicHome from "layouts/BasicHome"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import CreatePicker from "components/pickers/CreatePicker"
import { IPickerResponse } from "project-2-types/dist/interface"
import PickerDrawer from "components/pickers/PickerDrawer"
import SearchDataGrid from "components/SearchDataGrid"
import SortDataGrid from "components/SortDataGrid"
import UpdatePicker from "components/pickers/UpdatePicker"
import { getPickers } from "api/pickers"
import paths from "shared/paths"
import { useParams } from "react-router-dom"
import { useQuery } from "react-query"
import useQueryCache from "hooks/useQueryCache"
import { useUser } from "context/UserProvider"
import DataTable from "ui/DataTable"

const columns: GridColDef[] = [
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
      )
    },
  },
  {
    field: "action",
    headerName: "",
    width: 150,
    renderCell: (data: GridRenderCellParams<IPickerResponse>) => {
      return <UpdatePicker pickerId={data.row._id} />
    },
  },
]

const Pickers = () => {
  const params = useParams<{ id: string }>()
  const intl = useIntl()
  const { user } = useUser()

  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up("md"))

  const { GET_QUERY_KEY } = useQueryCache("pickers")

  const [open, setOpen] = useState<boolean>(false)
  const [pickers, setPickers] = useState<Array<IPickerResponse>>([])

  const [search, setSearch] = useState<string>()
  const [sortModel, setSortModel] = useState([
    {
      field: "createdAt",
      sort: "desc",
    },
  ])

  const showDrawer = () => setOpen(true)

  const hideDrawer = () => {
    setOpen(false)
    window.location.replace(paths.pickers)
  }

  const { isLoading } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: getPickers,
    onSuccess: (results) => {
      setPickers(results)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  useEffect(() => {
    if (params.id) {
      showDrawer()
    }
  }, [params.id])

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
            { field: "createdAt", sort: "desc", label: "Recently added" },
            { field: "createdAt", sort: "asc", label: "Long-standing" },
          ]}
        />

        <SearchDataGrid applySearch={setSearch} />
      </Box>

      <Box display="flex" flexGrow={1} pb={3}>
        <DataTable
          rows={pickers}
          columns={columns}
          loading={isLoading}
          initialState={{
            columns: {
              columnVisibilityModel: {
                phone: !!desktop,
                contactName: !!desktop,
                contactPhone: !!desktop,
                createdAt: !!desktop,
              },
            },
          }}
          filterModel={{
            items: [],
            quickFilterValues: search ? search?.split(" ") : [],
          }}
          sortModel={sortModel as Array<GridSortItem>}
          onSortModelChange={(model) => {
            setSortModel(model as any)
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {!!open && (
        <PickerDrawer pickerId={params.id} dismiss={hideDrawer} open />
        // Replace with Picker detail
      )}
    </BasicHome>
  )
}

export default Pickers
