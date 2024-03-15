import React, { useState, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import BasicHome from "layouts/BasicHome";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { ArrowLeft, CaretRight, SealCheck, X } from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";
import { useMutation } from "react-query";
import endpoints from "api/endpoints";
import { createPayroll, getPayrollPreview, PayrollPayload } from "api/payroll";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Label } from "ui/Typography";
import IconModalPayroll from '../../../assets/icons/IconModalPayroll.svg';

const columns: GridColDef[] = [
  {
    field: "no",
    headerName: "No.",
    width: 100,
  },
  {
    field: "name",
    headerName: "Picker",
    width: 150,
    renderCell: (params) => {
      return <span>{params.row.picker.name}</span>;
    },
  },
  {
    field: "grossAmount",
    headerName: "Gross Pay ($)",
    width: 150,
    renderCell: (params) => {
      return <span>{params.row.grossAmount}</span>;
    },
  },
  {
    field: "collectedAmount",
    headerName: "Harvest Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <span>
          {params.row.collectedAmount} {params.row.season.unit}
        </span>
      );
    },
  },
  {
    field: "deductions",
    headerName: "Deductions ($)",
    width: 150,
    renderCell: (params) => {
      return <span>{params.row.deductions}</span>;
    },
  },
  {
    field: "netAmount",
    headerName: "Net Pay ($)",
    width: 150,
    renderCell: (params) => {
      return <span>{params.row.netAmount}</span>;
    },
  },
];

function formatDate(value: number | Date): string {
  const date = new Date(value);

  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  return `${month} ${day}`;
}

const Preview: React.FC = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const location = useLocation();
  const seasonId = location.state.uniqueSeasonId[0];
  const farmId = location.state.uniqueFarmId[0];

  const intl = useIntl();
  const [payrollData, setPayrollData] = useState([]);
  const [isLoading] = useState(false);

  const [startDate, setStartDate] = useState<Dayjs>();
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());

  const [netPay, setNetPay] = useState(0);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [unit, setUnit] = useState(null);
  const [uniqueSeasonName, setUniqueSeasonName] = useState<string[]>([]);

  const { mutate: getPreview } = useMutation({
    mutationKey: [endpoints.payrolls, "preview"],
    mutationFn: getPayrollPreview,
    onSuccess: (data) => {
      const payrollDataWithId = data.details.map(
        (detail: unknown, index: number) => ({
          ...(detail as object),
          id: index,
          no: index + 1,
          season: data.season,
        })
      );

      setPayrollData(payrollDataWithId);
      setStartDate(dayjs(data.startDate));
      setNetPay(data.totals.netAmount);
      setCollectedAmount(data.totals.collectedAmount);
      setDeductions(data.totals.deductions);
      setUnit(data.season.unit);
      setUniqueSeasonName(data.season.name);
    },
    onError: () => {},
  });

  useEffect(() => {
    getPreview({
      endDate: endDate ? endDate.toDate().getTime() : undefined,
      farmId,
      seasonId,
    });
  }, [endDate]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const payload: PayrollPayload = {
        farmId: farmId,
        seasonId: seasonId,
        endDate: new Date().getTime(),
        totals: {
          totalGrossAmount: netPay,
          totalCollectedAmount: collectedAmount,
          totalDeductions: deductions,
        },
      };

      await createPayroll(payload);
    } catch (error) {
      console.error(
        "Error:",
        (error as any).response.status,
        (error as any).response.statusText
      );
    }

    setIsButtonClicked(true);

    setOpen(false);
  };

  const StyledSpan = ({ children }: { children: React.ReactNode }) => (
    <span
      style={{
        borderRadius: "var(--radius-md, 8px)",
        background: "var(--Colors-Gray-warm-100, #F5F5F4)",
        padding: "10px",
        width: "100%",
        minWidth: "162px",
        textAlign: "center",
      }}
    >
      {children}
    </span>
  );

  return (
    <BasicHome
      title={intl.formatMessage({
        id: "Start Payroll",
        defaultMessage: "Start a Payroll",
      })}
      breadcrumb={[
        { title: "Farm Name", href: "/" },
        {
          title: (
            <FormattedMessage id="sidebar.payrolls" defaultMessage="Payroll" />
          ),
          href: "/payroll",
        },
        {
          title: (
            <FormattedMessage
              id="start.payroll"
              defaultMessage="Start a Payroll"
            />
          ),
          href: "",
        },
      ]}
    >
      {isButtonClicked && (
        <Box style={{ border: "1px solid #000" }}>
          <div style={{ display: "inline-block" }}>
            <SealCheck size={32} />
            <h1 style={{ display: "inline", marginLeft: "5px" }}>
              You successfully ran the payroll!
            </h1>
          </div>
          <div>
            <span>
              Time to sit back and relax! Your payroll run was successful. You
              can check the latest payroll summary below.
            </span>
          </div>
          <Button
            variant="contained"
            onClick={() => (window.location.href = "/payroll")}
          >
            <ArrowLeft />
            Go back to dashboard
          </Button>
        </Box>
      )}

      {!isButtonClicked && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePayroll"]}>
              <span>Select the date range:</span>
              <span>From</span>
              <DatePicker
                value={startDate}
                onChange={(value) => {
                  if (value) {
                    setStartDate(value);
                  }
                }}
                readOnly
              />
              <span>to</span>
              <DatePicker
                value={endDate}
                onChange={(value) => {
                  if (value) {
                    setEndDate(value);
                  }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Run Payroll
            <CaretRight size={25} />
          </Button>

          {/* Modal Preview */}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
              style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <img
                src={IconModalPayroll}
                alt="Icon Modal Payroll"
                style={{
                  width: "80px",
                  height: "80px",
                  marginTop: "16px",
                }}
              />
              <button
                style={{
                  position: "absolute",
                  right: "34px",
                  top: "28px",
                  border: "none",
                  background: "none",
                }}
                onClick={handleClose}
              >
                <X size={24} color="#292524" />
              </button>
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                style={{
                  color: "var(--Colors-Gray-warm-900, #1C1917)",
                  textAlign: "center",
                  fontVariantNumeric: "lining-nums tabular-nums",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "32px",
                }}
              >
                Ready to run the payroll?
              </DialogContentText>
            </DialogContent>
            <div
              style={{
                display: "flex",
                height: "44px",
                padding: "20px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: "0 1 auto",
                gap: "12px",
              }}
            >
              <StyledSpan>{uniqueSeasonName}</StyledSpan>
              <StyledSpan>
                <FormattedDate
                  value={formatDate(startDate?.toDate() ?? new Date())}
                  month="short"
                  day="numeric"
                />
                -
                <FormattedDate
                  value={formatDate(endDate.toDate())}
                  month="short"
                  day="numeric"
                />
              </StyledSpan>
              <StyledSpan>{netPay}</StyledSpan>
            </div>
            <div style={{ padding: "0 32px" }}>
              <DialogActions
                style={{
                  borderTop: "1px solid var(--Colors-Brand-200, #E7E5E4)",
                  marginTop: "32px",
                  paddingTop: "32px",
                  paddingBottom: "32px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onClick={handleClose}
                  color="primary"
                  style={{ flex: 1, marginRight: "12px", height: "48px" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant="contained"
                  color="primary"
                  autoFocus
                  style={{ flex: 1, marginLeft: "12px", height: "48px" }}
                >
                  Confirm
                </Button>
              </DialogActions>
            </div>
          </Dialog>
        </Box>
      )}

      <Box display="flex" flexDirection="column" flexGrow={1} pb={3}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Label variant="h6" gutterBottom>
              Pay Period
            </Label>
          </Grid>
          <Grid item xs={3}>
            <Label variant="h6" gutterBottom>
              Total Net Pay
            </Label>
          </Grid>
          <Grid item xs={3}>
            <Label variant="h6" gutterBottom>
              Total Harvest Amount
            </Label>
          </Grid>
          <Grid item xs={3}>
            <Label variant="h6" gutterBottom>
              Total Deductions
            </Label>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <span>
              <FormattedDate
                value={formatDate(startDate?.toDate() ?? new Date())}
                month="short"
                day="numeric"
              />
              -
              <FormattedDate
                value={formatDate(endDate.toDate())}
                month="short"
                day="numeric"
              />
            </span>
          </Grid>
          <Grid item xs={3}>
            <Label variant="body1" gutterBottom>
              {netPay}
            </Label>
          </Grid>
          <Grid item xs={3}>
            <Label variant="body1" gutterBottom>
              {collectedAmount} {unit}
            </Label>
          </Grid>
          <Grid item xs={3}>
            <Label variant="body1" gutterBottom>
              {deductions}
            </Label>
          </Grid>
        </Grid>
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
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>
    </BasicHome>
  );
};

export default Preview;
