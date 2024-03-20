import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { ArrowLeft, CaretRight, SealCheck } from "@phosphor-icons/react";
import endpoints from "api/endpoints"
import { PayrollPayload, createPayroll, getPayrollPreview } from "api/payroll"
import dayjs, { Dayjs } from "dayjs"
import BasicHome from "layouts/BasicHome"
import React, { useEffect, useState } from "react"
import {
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  useIntl,
} from "react-intl"
import { useMutation } from "react-query";
import { DatePicker } from "@mui/x-date-pickers";
import { useUser } from "context/UserProvider";
import {
  IPayrollResponse,
  ISeasonResponse,
} from "project-2-types/dist/interface";
import { BodyText, Display, Label } from "ui/Typography";
import { useAlert } from "context/AlertProvider";
import { styled, useMediaQuery } from "@mui/system";
import SeasonFilterDataGrid from "components/SeasonFilterDataGrid";
import PayrollConfirmationModal from "components/payroll/PayrollConfirmationModal";

const columns = (currency: string, unit: string): GridColDef[] => [
  {
    field: "index",
    renderHeader: () => (
      <FormattedMessage
        id="payroll.preview.columns.no.header"
        defaultMessage="No."
      />
    ),
    width: 50,
    valueGetter: (params) => {
      return params.row.index + 1;
    },
  },
  {
    field: "name",
    renderHeader: () => (
      <FormattedMessage
        id="payroll.preview.columns.picker.header"
        defaultMessage="Picker"
      />
    ),
    flex: 1,
    minWidth: 100,
    valueGetter: (params) => {
      return params.row.picker.name;
    },
  },
  {
    field: "grossAmount",
    renderHeader: () => (
      <FormattedMessage
        id="payroll.preview.columns.gross_pay.header"
        defaultMessage="Gross Pay {currency}"
        values={{ currency }}
      />
    ),
    headerAlign: "right",
    align: "right",
    width: 150,
    renderCell: (params) => {
      return <FormattedNumber value={params.row.grossAmount} />;
    },
  },
  {
    field: "collectedAmount",
    renderHeader: () => (
      <FormattedMessage
        id="payroll.preview.columns.harvest_amount.header"
        defaultMessage="Harvest Amount"
      />
    ),
    headerAlign: "right",
    align: "right",
    width: 150,
    renderCell: (params) => {
      return (
        <span>
          <FormattedNumber value={params.row.collectedAmount} /> {unit}
        </span>
      );
    },
  },
  {
    field: "deductions",
    renderHeader: () => (
      <FormattedMessage
        id="payroll.preview.columns.deductions.header"
        defaultMessage="Deductions {currency}"
        values={{ currency }}
      />
    ),
    headerAlign: "right",
    align: "right",
    width: 150,
    renderCell: (params) => {
      return <FormattedNumber value={params.row.deductions} />;
    },
  },
  {
    field: "netAmount",
    renderHeader: () => (
      <FormattedMessage
        id="payroll.preview.columns.net_pay.header"
        defaultMessage="Net Pay {currency}"
        values={{ currency }}
      />
    ),
    headerAlign: "right",
    align: "right",
    width: 100,
    renderCell: (params) => {
      return <FormattedNumber value={params.row.netAmount} />;
    },
  },
  {
    field: "actions",
    width: 50,
  },
];

const Preview: React.FC = () => {
  const { user } = useUser();
  const { showAlert } = useAlert();

  const intl = useIntl();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  // const [params] = useSearchParams()
  // const seasonId = params.get("seasonId")

  const [payrollData, setPayrollData] = useState<IPayrollResponse | null>(null);

  const [startDate, setStartDate] = useState<Dayjs>();
  const [endDate, setEndDate] = useState<Dayjs>();

  const [selectedSeason, setSelectedSeason] = useState<ISeasonResponse>();

  const [payrollDone, setPayrollDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const { mutate: getPreview } = useMutation({
    mutationKey: [endpoints.payrolls, "preview"],
    mutationFn: getPayrollPreview,
    onSuccess: (data: any) => {
      setPayrollData(data);

      !startDate && setStartDate(dayjs(data?.nextEstimatedPayroll.startDate));
      !endDate && setEndDate(dayjs(data?.nextEstimatedPayroll.endDate));
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "payroll.preview.get.error",
          defaultMessage: "Oops! Preview is not available.",
        }),
        "error"
      );
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      if (!selectedSeason?._id || !payrollData || !startDate || !endDate) {
        return;
      }
      setIsLoading(true);

      const payload: PayrollPayload = {
        farmId: user.farm._id,
        seasonId: selectedSeason?._id,
        endDate: endDate.valueOf(),
        startDate: startDate.valueOf(),
        totals: {
          totalGrossAmount: payrollData?.totals.grossAmount,
          totalCollectedAmount: payrollData?.totals.collectedAmount,
          totalDeductions: payrollData?.totals.deductions,
        },
      };

      await createPayroll(payload);
      setPayrollDone(true);
      setOpen(false);
    } catch (error) {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "payroll.preview.run.error",
          defaultMessage: "Oops! Payroll could not be saved.",
        }),
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSeason?._id) {
      getPreview({
        endDate: endDate ? endDate.toDate().getTime() : undefined,
        startDate: startDate ? startDate.toDate().getTime() : undefined,
        farmId: user.farm._id,
        seasonId: selectedSeason?._id,
      });
    }
  }, [endDate, selectedSeason?._id]);

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
              id="breadcrumb.run_payroll"
              defaultMessage="Run a Payroll"
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
        <PayrollFilters>
          <div className="filter-container">
            <div className="date-filter">
              <BodyText size="md" sx={{ flexShrink: 0 }}>
                Active Season
              </BodyText>
              <SeasonFilterDataGrid
                onChange={setSelectedSeason}
                status="ACTIVE"
                sx={{ width: !desktop ? "100%" : undefined }}
                defaultFirst={false}
              />
            </div>
            <div className="filters">
              <div className="date-filter">
                <BodyText size="md">From</BodyText>
                <DatePicker
                  value={startDate}
                  slotProps={{ textField: { size: "small" } }}
                  onChange={(value) => {
                    if (value) {
                      setStartDate(value);
                    }
                  }}
                />
              </div>
              <div className="date-filter">
                <BodyText size="md">to</BodyText>
                <DatePicker
                  value={endDate}
                  slotProps={{ textField: { size: "small" } }}
                  onChange={(value) => {
                    if (value) {
                      setEndDate(value);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <PayrollTotals className="totals-container">
            <Card>
              <Label
                size="sm"
                fontWeight="SemiBold"
                tabIndex={0}
                arial-label={`Pay period from ${intl.formatDate(
                  startDate?.toDate(),
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )} to ${intl.formatDate(endDate?.toDate(), {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })} `}
              >
                Pay Period
              </Label>
              <Display
                aria-hidden
                size="xs"
                fontWeight="SemiBold"
                display="flex"
                gap={1}
              >
                <Box aria-hidden>
                  <FormattedDate
                    value={startDate?.toDate()}
                    month="short"
                    day="numeric"
                  />
                </Box>
                <Box aria-hidden>-</Box>
                <Box aria-hidden>
                  <FormattedDate
                    value={endDate?.toDate()}
                    month="short"
                    day="numeric"
                  />
                </Box>
              </Display>
            </Card>
            <Card>
              <Label size="sm" fontWeight="SemiBold">
                Total Net Pay
              </Label>
              <Display size="xs" fontWeight="SemiBold">
                {payrollData?.totals?.netAmount}
              </Display>
            </Card>
            <Card>
              <Label size="sm" fontWeight="SemiBold">
                Total Harvest Amount
              </Label>
              <Display size="xs" fontWeight="SemiBold">
                {payrollData?.totals.collectedAmount}{" "}
                {payrollData?.season?.unit}
              </Display>
            </Card>
            <Card>
              <Label size="sm" fontWeight="SemiBold">
                Total Deductions
              </Label>
              <Display size="xs" fontWeight="SemiBold">
                {payrollData?.totals.deductions}
              </Display>
            </Card>
          </PayrollTotals>

          <Button
            variant="contained"
            color="primary"
            sx={{ width: "min-content" }}
            onClick={handleClickOpen}
            className="run-payroll-button"
          >
            Run Payroll
            <CaretRight size={25} />
          </Button>
        </PayrollFilters>
      )}

      {/* Payroll Confirmation Modal */}
      <PayrollConfirmationModal
        open={open}
        onClose={handleClose}
        onCancel={handleClose}
        isLoading={isLoading}
        data={{
          seasonName: payrollData?.season.name,
          startDate: startDate?.toDate(),
          endDate: endDate?.toDate(),
          netAmount: payrollData?.totals.netAmount,
          currency: payrollData?.season.currency,
        }}
        onConfirm={handleConfirm}
      />

      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
                index: !!desktop,
                grossAmount: !!desktop,
                collectedAmount: !!desktop,
                deductions: !!desktop,
              },
            },
          }}
          rows={payrollData?.details ?? []}
          columns={columns(
            payrollData?.season?.currency ?? "",
            payrollData?.season?.unit ?? ""
          )}
          disableRowSelectionOnClick
          getRowId={(row) => row?.picker?.id}
        />
      </Box>
    </BasicHome>
  );
};

const Card = styled(Box)`
  background-color: white;
  padding: ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.75)};
  border-radius: 0.5rem;
  flex: 1;
`;

const PayrollTotals = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: ${({ theme }) => theme.spacing(2)};
  ${(props) => props.theme.breakpoints.up("md")} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const PayrollFilters = styled(Box)`
  // Mobile
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};

  .filter-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing(1)};

    .filters {
      display: flex;
      flex-direction: row;
      gap: ${({ theme }) => theme.spacing(2)};

      .date-filter {
        display: flex;
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing(0.5)};
      }
    }
  }

  // Desktop
  ${(props) => props.theme.breakpoints.up("md")} {
    display: grid;
    grid-template-columns: auto 10rem;

    .filter-container {
      grid-column: 1;
      display: flex;
      align-items: center;
      flex-direction: row;

      .date-filter {
        display: flex;
        flex-direction: row !important;
        align-items: center;
        gap: ${({ theme }) => theme.spacing(1.25)} !important;
      }
    }

    .totals-container {
      grid-column: 1/-1;
      grid-row: 2;
    }

    .run-payroll-button {
      grid-column: 2;
    }
  }
`;

export default Preview
