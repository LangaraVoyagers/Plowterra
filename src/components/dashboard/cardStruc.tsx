import { FormattedDate, FormattedMessage } from "react-intl"

import { Box, Skeleton } from "@mui/material";
import { ISeasonResponse } from "project-2-types";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";

const cardStruc = (
  isLoading: boolean,
  season?: ISeasonResponse,
  payrollToTodayData?: any,
  totals: any = {},
  lastPayrolls?: any,
  averages: any = {}
) => {
  const currencyName = season?.currency?.name;
  const unitName = season?.unit?.name;

  const CIRCULAR_LOADER = (
    <Skeleton
      animation="wave"
      width="130px"
      sx={({ palette }) => {
        return {
          background: palette.grey[100],
        };
      }}
    />
  );

  return {
    harvestInfo: [
      {
        label: (
          <FormattedMessage
            defaultMessage="PRODUCT"
            id="dashboard.labels.product"
          />
        ),
        content: isLoading ? CIRCULAR_LOADER : season?.product?.name,
      },
      {
        label: (
          <FormattedMessage
            defaultMessage="START DATE"
            id="dashboard.labels.startDate"
          />
        ),
        content: isLoading ? (
          CIRCULAR_LOADER
        ) : (
          <FormattedDate
            value={season?.startDate}
            year="numeric"
            month="short"
            day="2-digit"
          />
        ),
      },
      {
        label: (
          <FormattedMessage
            defaultMessage="PRICE PER UNIT"
            id="dashboard.labels.pricePerUnit"
          />
        ),
        content: isLoading
          ? CIRCULAR_LOADER
          : `${currencyName} ${Number(season?.price).toFixed(2)}`,
      },
      {
        label: (
          <FormattedMessage
            defaultMessage="HARVEST DAYS"
            id="dashboard.labels.harvestDays"
          />
        ),
        content: isLoading ? CIRCULAR_LOADER : totals?.harvestDays,
      },
      {
        label: (
          <FormattedMessage
            defaultMessage="TOTAL HARVEST AMOUNT"
            id="dashboard.labels.totalHarvestAmount"
          />
        ),
        content: isLoading
          ? CIRCULAR_LOADER
          : `${Number(totals?.totalHarvest).toFixed(2)} ${unitName}`,
      },
    ],
    midSectionInfo: [
      {
        label: (
          <FormattedMessage
            defaultMessage="SEASON'S TOTAL PAYROLL"
            id="dashboard.labels.seasonsTotalPayroll"
          />
        ),
        content: isLoading
          ? CIRCULAR_LOADER
          : `${currencyName} ${Number(totals?.totalPayroll).toFixed(2)}`,
        perIncrease: isLoading ? (
          `%`
        ) : (
          <Box display="flex" gap={1} alignItems="center">
            {(averages.aveHarvestChange || 0) ===
            0 ? null : averages.avePayrollChange > 0 ? (
              <ArrowUp weight="bold" />
            ) : (
              <ArrowDown weight="bold" />
            )}
            {`${averages?.avePayrollChange?.toFixed(2) ?? 0} %`}
          </Box>
        ),
      },
      {
        label: (
          <FormattedMessage
            defaultMessage="TODAY'S COLLECTION"
            id="dashboard.labels.todaysCollection"
          />
        ),
        content: isLoading
          ? CIRCULAR_LOADER
          : `${Number(totals?.todaysHarvest).toFixed(2)} ${unitName}`,
        perIncrease: isLoading ? (
          `%`
        ) : (
          <Box display="flex" gap={1} alignItems="center">
            {(averages.aveHarvestChange || 0) ===
            0 ? null : averages.aveHarvestChange > 0 ? (
              <ArrowUp weight="bold" />
            ) : (
              <ArrowDown weight="bold" />
            )}
            {`${averages?.aveHarvestChange?.toFixed(2) ?? 0} %`}
          </Box>
        ),
      },
    ],
    payrollInfo: {
      payrollToToday: {
        label: (
          <FormattedMessage
            defaultMessage="PAYROLL TO THIS DAY"
            id="dashboard.labels.payrollToThisDate"
          />
        ),
        content: isLoading
          ? CIRCULAR_LOADER
          : `${currencyName} ${Number(payrollToTodayData?.grossAmount).toFixed(
              2
            )}`,
        startDate: (
          <FormattedDate
            value={payrollToTodayData?.startDate}
            month="short"
            day="2-digit"
          />
        ),
        daysLeft: isLoading ? "-" : payrollToTodayData?.daysRemaining,
        status:
          (payrollToTodayData?.daysRemaining || 0) === 0
            ? "no_records"
            : payrollToTodayData?.daysRemaining > 0
            ? "upcoming"
            : "overdue",
      },
      lastPayrolls: lastPayrolls?.slice(0, 3),
    },
    unitName,
    currencyName,
  };
};

export default cardStruc;
