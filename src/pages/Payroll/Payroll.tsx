import { useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import BasicHome from "layouts/BasicHome";
import useQueryCache from "hooks/useQueryCache";
import { useQuery } from "react-query";
import { getPayrollHistory } from "api/payroll";
import { User } from "@phosphor-icons/react";
import { useUser } from "context/UserProvider";
import { Select, MenuItem } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "period",
    headerName: "Pay Period",
    width: 200,
    renderCell: (params) => {
      const startDate = formatDate(params.row.startDate);
      const endDate = formatDate(params.row.endDate);
      return <span>{`${startDate} - ${endDate}`}</span>;
    },
  },
  {
    field: "totals.grossAmount",
    headerName: "Total Amount ($)",
    width: 150,
    renderCell: (params) => <span>{params.row.totals.grossAmount}</span>,
  },
  {
    field: "totals.collectedAmount",
    headerName: "Total harvest",
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
    headerName: "Pay date",
    width: 150,
    renderCell: (params) => <span>{formatDate(params.value)}</span>,
  },
];

function formatDate(value: number | Date): string {
  const date = new Date(value);

  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  return `${month} ${day}`;
}

const Payroll = () => {
  const { user } = useUser();
  const intl = useIntl();
  const [payrollData, setPayrollData] = useState([]);
  const { GET_QUERY_KEY } = useQueryCache("payrolls");

  const { isLoading, data } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: getPayrollHistory,
    onSuccess: (results) => {
      setPayrollData(results);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  let seasonOptions: JSX.Element[] = [];
  let uniqueSeasonName: string[] = [];
  if (data && data.length > 0) {
    uniqueSeasonName = [...new Set((data as any[]).map((item: any) => item.season.name))];
    seasonOptions = uniqueSeasonName.map((name: string) => (
      <MenuItem key={name.toString()} value={name}>
        {name}
      </MenuItem>
    ));
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
            <FormattedMessage id="sidebar.payrolls" defaultMessage="Payrolls" />
          ),
          href: "",
        },
      ]}
      actions={<Button variant="contained">Start a payroll</Button>}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1>Payroll History</h1>
        <Select><p>Season: </p>{seasonOptions}</Select>
      </Box>
      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid
          rows={payrollData}
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

export default Payroll;
