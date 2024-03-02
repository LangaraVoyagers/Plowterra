import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import BasicHome from "layouts/BasicHome";

const CustomPayroll = () => {
  const intl = useIntl();

  const payrollData = [
    {
      id: "1",
      totals: {
        netAmount: 4000,
        collectedAmount: 1002,
        grossAmount: 10001,
        deductions: 103
      },
      _id: "65e2800c156682e7d7b70346",
      farm: "65e27b99156682e7d7b7028d",
      startDate: 12345,
      endDate: 1692169200000,
      pickersCount: 15,
      season: {
        id: "65e27c81156682e7d7b702a4",
        name: "Season 1",
        currency: "USD$",
        price: "3.59",
        product: "Product-2",
        unit: "bin",
        _id: "65e2800c156682e7d7b70347"
      },
      details: []
    },
    {
        id: "2",
        totals: {
          netAmount: 4000,
          collectedAmount: 2002,
          grossAmount: 20001,
          deductions: 203
        },
        _id: "65e2800c156682e7d7b70346",
        farm: "65e27b99156682e7d7b7028d",
        startDate: 12345,
        endDate: 1692169200000,
        pickersCount: 10,
        season: {
          id: "65e27c81156682e7d7b702a4",
          name: "Season 1",
          currency: "USD$",
          price: "3.59",
          product: "Product-2",
          unit: "bin",
          _id: "65e2800c156682e7d7b70347"
        },
        details: []
      },
      {
        id: "3",
        totals: {
          netAmount: 4000,
          collectedAmount: 3002,
          grossAmount: 30001,
          deductions: 303
        },
        _id: "65e2800c156682e7d7b70346",
        farm: "65e27b99156682e7d7b7028d",
        startDate: 12345,
        endDate: 1692169200000,
        pickersCount: 20,
        season: {
          id: "65e27c81156682e7d7b702a4",
          name: "Season 1",
          currency: "USD$",
          price: "3.59",
          product: "Product-2",
          unit: "bin",
          _id: "65e2800c156682e7d7b70347"
        },
        details: []
      }
  ];

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const columns = [
    {
      field: "period",
      headerName: "Pay Period",
      width: 200,
      renderCell: (params) => {
        const startDate = formatDate(params.row.startDate);
        const endDate = formatDate(params.row.endDate);
        return (
          <span>
            {`${startDate} - ${endDate}`} 
          </span>
        );
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
      renderCell: (params) => <span>{params.row.totals.collectedAmount}</span>,
    },
    {
      field: "totals.deductions",
      headerName: "Deductions ($)",
      width: 150,
      renderCell: (params) => <span>{params.row.totals.deductions}</span>,
    },
    { field: "pickersCount", headerName: "Pickers", width: 150 },
    { 
        field: "endDate", 
        headerName: "Pay date", 
        width: 150, 
        renderCell: (params) => (
          <span>{formatDate(params.value)}</span>
        ),
      },
  ];

  return (
    <BasicHome
      title={intl.formatMessage({ id: "payrolls", defaultMessage: "Payroll" })}
      subtitle={intl.formatMessage({
        id: "payrolls.subtitle",
        defaultMessage:
          "Create the payrolls and view previous payroll records.",
      })}
      breadcrumb={[
        { title: "Farm Name", href: "/" },
        {
          title: (
            <FormattedMessage
              id="sidebar.payrolls"
              defaultMessage="Payrolls"
            />
          ),
          href: "",
        },
      ]}
      actions={<Button variant="contained">Start a payroll</Button>}
    >

    <Typography variant="h2">
    Payroll History
    </Typography>

      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid rows={payrollData} columns={columns} />
      </Box>
    </BasicHome>
  );
};

export default CustomPayroll;
