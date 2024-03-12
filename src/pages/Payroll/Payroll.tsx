import { Box, Button, MenuItem, Select } from "@mui/material"
import { SelectChangeEvent } from "@mui/material/Select"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { CaretRight, User } from "@phosphor-icons/react"
import { getPayrollHistory } from "api/payroll"
import { getSeasons } from "api/seasons"
import { useUser } from "context/UserProvider"
import useQueryCache from "hooks/useQueryCache"
import BasicHome from "layouts/BasicHome"
import { ISeasonResponse } from "project-2-types/dist/interface"
import { useState } from "react"
import { FormattedDate, FormattedMessage, useIntl } from "react-intl"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import { Display } from "ui/Typography"

const columns: GridColDef[] = [
  {
    field: "period",
    headerName: "Pay Period",
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <span>
          <FormattedDate
            value={params.row.startDate}
            month="short"
            day="numeric"
          />
          -
          <FormattedDate
            value={params.row.endDate}
            month="short"
            day="numeric"
          />
        </span>
      )
    },
  },
  {
    field: "totals.grossAmount",
    headerName: "Total net pay ($)",
    width: 150,
    renderCell: (params) => <span>{params.row.totals.grossAmount}</span>,
  },
  {
    field: "totals.collectedAmount",
    headerName: "Harvest Amount",
    width: 150,
    renderCell: (params) => (
      <span>
        {params.row.totals.collectedAmount} {params.row.season.unit}
      </span>
    ),
  },
  {
    field: "totals.deductions",
    headerName: "Deductions ($)",
    width: 150,
    renderCell: (params) => <span>{params.row.totals.deductions}</span>,
  },
  {
    field: "pickersCount",
    headerName: "Pickers",
    width: 150,
    renderCell: (params) => (
      <span>
        <User /> {params.row.pickersCount}
      </span>
    ),
  },
  {
    field: "endDate",
    headerName: "Pay Date",
    width: 150,
    renderCell: (params) => <span>{formatDate(params.value)}</span>,
  },
]

function formatDate(value: number | Date): string {
  const date = new Date(value)

  const month = date.toLocaleString("default", { month: "short" })
  const day = date.getDate()

  return `${month} ${day}`
}

const Payroll = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const intl = useIntl()

  const { GET_QUERY_KEY } = useQueryCache("payrolls")
  const { GET_QUERY_KEY: SEASONS_QUERY_KEY } = useQueryCache("seasons")

  const [payrollData, setPayrollData] = useState([])
  const [seasonsData, setSeasonsData] = useState<Array<ISeasonResponse>>()
  const [selectedSeason, setSelectedSeason] = useState<ISeasonResponse>()

  // Get seasons
  const { isFetched } = useQuery({
    queryKey: SEASONS_QUERY_KEY,
    queryFn: getSeasons,
    onSuccess: (results) => {
      setSeasonsData(results)
      setSelectedSeason(results?.[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const { isLoading } = useQuery({
    queryKey: [...GET_QUERY_KEY, selectedSeason?._id],
    queryFn: () => getPayrollHistory({ seasonId: selectedSeason?._id }),
    enabled: !!selectedSeason?._id || isFetched,
    onSuccess: (results) => {
      setPayrollData(results)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const onSeasonChange = (event: SelectChangeEvent<any>) => {
    const season = seasonsData?.find((s) => s._id === event.target.value)
    setSelectedSeason(season)
  }

  return (
    <BasicHome
      title={intl.formatMessage({ id: "payrolls", defaultMessage: "Payroll" })}
      subtitle={intl.formatMessage({
        id: "payrolls.subtitle",
        defaultMessage:
          "Create the payrolls and view previous payroll records.",
      })}
      breadcrumb={[
        { title: user.farm.name, href: "/" },
        {
          title: (
            <FormattedMessage id="sidebar.payroll" defaultMessage="Payrolls" />
          ),
          href: "",
        },
      ]}
      actions={
        <Button
          variant="contained"
          onClick={() =>
            navigate(`/payroll/preview?seasonId=${selectedSeason?._id}`)
          }
          endIcon={<CaretRight size={25} />}
        >
          Start a payroll
        </Button>
      }
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Display size="md">Payroll History</Display>
        {!!seasonsData?.length && (
          <Select
            defaultValue={selectedSeason?._id}
            value={selectedSeason?._id}
            size="small"
            onChange={onSeasonChange}
          >
            {seasonsData?.map((season) => (
              <MenuItem key={season._id} value={season._id}>
                {season.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>

      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid
          rows={payrollData}
          columns={columns}
          loading={isLoading}
          getRowId={(data) => data?._id}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
        />
      </Box>
    </BasicHome>
  )
}

export default Payroll
