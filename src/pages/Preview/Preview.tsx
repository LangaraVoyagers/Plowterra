import {
  Box, Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  ArrowLeft,
  CaretRight,
  SealCheck,
} from "@phosphor-icons/react";
import endpoints from "api/endpoints";
import { PayrollPayload, createPayroll, getPayrollPreview } from "api/payroll";
import dayjs, { Dayjs } from "dayjs";
import BasicHome from "layouts/BasicHome";
import React, { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { useMutation } from "react-query";

import { DatePicker } from "@mui/x-date-pickers";
import { useUser } from "context/UserProvider";
import { IPayrollResponse } from "project-2-types/dist/interface";
import { useSearchParams } from "react-router-dom";
import { Label } from "ui/Typography";

const columns = (currency: string): GridColDef[] => [
  {
    field: "index",
    headerName: "No.",
    width: 100,
  },
  {
    field: "name",
    headerName: "Picker",
    width: 150,
    renderCell: (params) => {
      return <span>{params.row.picker.name}</span>
    },
  },
  {
    field: "grossAmount",
    headerName: `Gross Pay ${currency}`,
    width: 150,
    renderCell: (params) => {
      return <span>{params.row.grossAmount}</span>
    },
  },
  {
    field: "collectedAmount",
    headerName: "Harvest Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <span>
          {params.row.collectedAmount} {params.row.season?.unit}
        </span>
      )
    },
  },
  {
    field: "deductions",
    headerName: `Deductions (${currency})`,
    width: 150,
    renderCell: (params) => {
      return <span>{params.row.deductions}</span>
    },
  },
  {
    field: "netAmount",
    headerName: `Net Pay (${currency})`,
    width: 150,
    renderCell: (params) => {
      return <span>{params.row.netAmount}</span>
    },
  },
]

function formatDate(value: number | Date): string {
  const date = new Date(value)

  const month = date.toLocaleString("default", { month: "short" })
  const day = date.getDate()

  return `${month} ${day}`
}

const Preview: React.FC = () => {
  const { user } = useUser()

  const intl = useIntl()

  const [params] = useSearchParams()
  const seasonId = params.get("seasonId")

  const [payrollData, setPayrollData] = useState<IPayrollResponse | null>(null)

  const [startDate, setStartDate] = useState<Dayjs>()
  const [endDate, setEndDate] = useState<Dayjs>(dayjs())

  const [payrollDone, setPayrollDone] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  const { mutate: getPreview } = useMutation({
    mutationKey: [endpoints.payrolls, "preview"],
    mutationFn: getPayrollPreview,
    onSuccess: (data) => {
      setPayrollData(data)
      setStartDate(dayjs(data?.startDate))
    },
    onError: () => {},
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    try {
      if (!seasonId || !payrollData || !startDate) {
        return
      }

      const payload: PayrollPayload = {
        farmId: user.farm._id,
        seasonId: seasonId,
        endDate: endDate.valueOf(),
        startDate: startDate.valueOf(),
        totals: {
          totalGrossAmount: payrollData?.totals.grossAmount,
          totalCollectedAmount: payrollData?.totals.collectedAmount,
          totalDeductions: payrollData?.totals.deductions,
        },
      }

      await createPayroll(payload)

      setPayrollDone(true)
    } catch (error) {
      console.error(
        "Error:",
        (error as any).response.status,
        (error as any).response.statusText
      )
    }
    setOpen(false)
  }

  useEffect(() => {
    if (seasonId) {
      getPreview({
        endDate: endDate ? endDate.toDate().getTime() : undefined,
        farmId: user.farm._id,
        seasonId,
      })
    }
  }, [endDate, seasonId])

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
            <FormattedMessage id="sidebar.payroll" defaultMessage="Payroll" />
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
      {!!payrollDone && (
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

      {!payrollDone && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" gap="1rem" alignItems="center">
            <span>Select the date range:</span>
            <span>From</span>
            <DatePicker
              value={startDate}
              slotProps={{ textField: { size: "small" } }}
              onChange={(value) => {
                if (value) {
                  setStartDate(value)
                }
              }}
            />
            <span>to</span>
            <DatePicker
              value={endDate}
              slotProps={{ textField: { size: "small" } }}
              onChange={(value) => {
                if (value) {
                  setEndDate(value)
                }
              }}
            />
          </Box>

          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Run Payroll
            <CaretRight size={25} />
          </Button>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"ICON"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Ready to run the payroll?
              </DialogContentText>
            </DialogContent>
            <Label>{payrollData?.season?.name}</Label>
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
            <Label>{payrollData?.totals.netAmount}</Label>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirm} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
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
            <Label gutterBottom>{payrollData?.totals?.netAmount}</Label>
          </Grid>
          <Grid item xs={3}>
            <Label  gutterBottom>
              {payrollData?.totals.collectedAmount} {payrollData?.season?.unit}
            </Label>
          </Grid>
          <Grid item xs={3}>
            <Label  gutterBottom>
              {payrollData?.totals.deductions}
            </Label>
          </Grid>
        </Grid>
      </Box>

      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid
          rows={payrollData?.details ?? []}
          columns={columns(payrollData?.season?.currency ?? "")}
          disableRowSelectionOnClick
          getRowId={(row) => row?.picker?.id}
        />
      </Box>
    </BasicHome>
  )
}

export default Preview
