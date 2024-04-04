import {
  ArrowRight,
  ArrowUp,
  FilePlus,
  HandCoins,
  Plant,
} from "@phosphor-icons/react";
import {
  Box,
  BoxProps,
  Button,
  Divider,
  Grid,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { BodyText, Display, Label } from "ui/Typography";
import { FormattedDate, FormattedMessage } from "react-intl";
import { Fragment, ReactNode, useEffect, useState } from "react";
import {
  getDate,
  getEpochForDeltaDays,
  getGreeting,
} from "shared/date-helpers";
import { getGraphValues, getIndicators } from "api/dashbaoard";

import { ApexOptions } from "apexcharts";
import SeasonFilterDataGrid from "components/SeasonFilterDataGrid";
import SplineGraph from "./SplineGraph";
import cardStruc from "./cardStruc";
import { useAlert } from "context/AlertProvider";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useThemMode } from "context/ThemeProvider";
import { useUser } from "context/UserProvider";

const gridGap = "1.5rem";
const borderRadius = "0.5rem";
const seperator = { xl: "2px solid #D7D3D0" };

const cardProps = {
  backgroundColor: "background.paper",
  borderRadius,
  padding: "1.5rem",
  width: "100%",
  height: "100%",
};

const DashBoardLayout = () => {
  const { mode } = useThemMode();
  const { user } = useUser();
  const theme = useTheme();
  const intl = useIntl();
  const navigate = useNavigate();
  const USER_GREETING = getGreeting();
  const FORMATTED_DATE = getDate(new Date().getTime());
  const { showAlert } = useAlert();
  const [cardInfo, setCardInfo] = useState<any>(cardStruc(true));
  const [seasonSelected, setSeasonSelected] = useState<any>();
  const [graphSeries, setGraphSeries] = useState<any>([]);
  const [daysDelta, setDaysDelta] = useState<any>("all");
  const [fromDate, setFromDate] = useState<any>(`0000000000000`);

  const { isLoading: isCardInfoLoading } = useQuery({
    queryKey: seasonSelected?._id,
    queryFn: () => getIndicators(seasonSelected?._id),
    enabled: !!seasonSelected?._id,
    onSuccess: (results) => {
      const { season, payrollToTodayData, totals, lastPayrolls } = results;

      setCardInfo(
        cardStruc(false, season, payrollToTodayData, totals, lastPayrolls)
      );
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "dashboard.get.indicators.error",
          defaultMessage: "Some error occurred, Please try again later",
        }),
        "error"
      );
    },
  });

  const { isLoading: isGraphLoading } = useQuery({
    queryKey: [intl.locale, seasonSelected?._id, fromDate],
    queryFn: () =>
      getGraphValues(seasonSelected?._id, fromDate, new Date().getTime()),
    enabled: !!seasonSelected?._id,
    onSuccess: (results) => {
      const name = intl.formatMessage({
        defaultMessage: "Harvest Amount",
        id: "dashboard.tooltip.yaxis",
      });
      const data: any = [];
      results?.map((item: any) => {
        const date = new Date(item?.date).getTime();
        const formatOptions = {
          year: "numeric",
          month: "short",
          day: "2-digit",
        } as const;
        data.push({
          x: intl.formatDate(date, formatOptions),
          y: item?.collectedAmount,
        });
      });
      setGraphSeries([{ name, data }]);
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "dashboard.get.graph.error",
          defaultMessage: "Some error occurred, Please try again later",
        }),
        "error"
      );
    },
  });

  useEffect(() => {
    setFromDate(getEpochForDeltaDays(daysDelta));
  }, [daysDelta]);

  return (
    <Box padding={{ md: "2rem" }}>
      <Grid
        container
        mb="2rem"
        rowSpacing={gridGap}
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Grid item>
          <Display fontSize="md" fontWeight="Bold" variant="h1">
            {USER_GREETING}, {user.name}
          </Display>
          <Box mt="1.25rem" display="flex" gap={1}>
            <BodyText>
              <FormattedMessage
                id="dashboard.greeting"
                defaultMessage="Today is"
              />
            </BodyText>

            <Box
              px="5px"
              bgcolor="background.paper"
              width="fit-content"
              border="1px solid #D7D3D0"
              borderRadius="4px"
            >
              <BodyText size="sm" color="grey-500" fontWeight="SemiBold">
                {FORMATTED_DATE}
              </BodyText>
            </Box>
          </Box>
        </Grid>
        <Grid item>
          <Button
            onClick={() => navigate("/harvest-logs?new=true")}
            variant="contained"
            endIcon={<FilePlus />}
          >
            Add Harvest Entry
          </Button>
        </Grid>
      </Grid>
      <HarvestInfo
        theme={theme}
        mode={mode}
        cardInfo={cardInfo?.harvestInfo}
        seasonSelected={seasonSelected}
        setSeasonSelected={setSeasonSelected}
      />
      <MidSectionInfo
        theme={theme}
        mode={mode}
        isGraphLoading={isGraphLoading}
        cardInfo={cardInfo?.midSectionInfo}
        daysDelta={daysDelta}
        setDaysDelta={setDaysDelta}
        unitName={cardInfo?.unitName}
        series={graphSeries}
      />
      <Divider
        style={{
          marginTop: "2.5rem",
          background: theme.palette.grey[300],
        }}
        variant="fullWidth"
      />
      <PayrollInfo
        theme={theme}
        navigate={navigate}
        seasonSelected={seasonSelected}
        isCardInfoLoading={isCardInfoLoading}
        cardInfo={cardInfo?.payrollInfo}
      />
    </Box>
  );
};

export interface ISeasonOptions {
  label: string;
  value: string;
}

interface ICardLayout {
  label: string;
  content: string | ReactNode | undefined;
  boxProps?: BoxProps;
  labelColor?: string;
}

export interface IApexChartProps {
  series: any;
  options: ApexOptions;
}

const CardLayout = (props: ICardLayout) => {
  return (
    <Box {...props?.boxProps}>
      <Label size="sm">{props.label}</Label>
      <Display lineHeight="2" size="xs" fontWeight="SemiBold">
        {props.content}
      </Display>
    </Box>
  );
};

const HarvestInfo = (props: any) => {
  const { theme, cardInfo, setSeasonSelected } = props;

  return (
    <Grid item {...cardProps} xs={12}>
      <Box mb="1.5rem">
        <SeasonFilterDataGrid
          status="ACTIVE"
          defaultFirst={false}
          getDefaultSeasonId={(seasonId) =>
            setSeasonSelected({ _id: seasonId })
          }
          onChange={setSeasonSelected}
          sx={{
            control: {
              fontSize: "1.25rem",
              fontWeight: 600,
              width: "16.375rem",
              height: "3.375rem",
            },
            menu: {
              width: "16.375rem",
            },
          }}
        />
      </Box>
      <Grid
        container
        rowSpacing={{ xs: "2rem" }}
        columnSpacing={{ lg: "2rem" }}
      >
        {cardInfo?.map((item: any, idx: number) => {
          return (
            <Grid key={idx} item xs={12} md={6} lg={3} xl={2.25}>
              <CardLayout
                label={item.label}
                content={item.content}
                labelColor={theme.palette.grey[500]}
                boxProps={
                  idx === cardInfo.length - 1
                    ? {}
                    : {
                        borderRight: seperator,
                      }
                }
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

const MidSectionInfo = (props: any) => {
  const {
    theme,
    mode,
    series,
    unitName,
    daysDelta,
    setDaysDelta,
    isGraphLoading,
  } = props;

  return (
    <Grid container pt={gridGap} columnSpacing={gridGap} alignItems="stretch">
      <Grid item xs={12} lg={8} xl={9}>
        <Box {...cardProps} pb="0">
          <SplineGraph
            isLoading={isGraphLoading}
            mode={mode}
            daysDelta={daysDelta}
            setDaysDelta={setDaysDelta}
            unitName={unitName}
            series={series}
          />
        </Box>
      </Grid>
      <Grid item mt={{ xs: gridGap, lg: 0 }} xs={12} lg={4} xl={3}>
        <Grid container direction="row" height={{ lg: "100%" }} gap={gridGap}>
          {props?.cardInfo?.map((item: any, idx: number) => {
            return (
              <Grid key={idx} item xs={12}>
                <CardLayout
                  label={item?.label}
                  content={
                    <Fragment>
                      <span>{item?.content}</span>
                      <Label
                        mt="1rem"
                        color="grey-500"
                        size="sm"
                        textTransform="none"
                        display="flex"
                        alignItems="center"
                      >
                        <Label
                          color="primary-900"
                          fontSize="0.875rem"
                          fontWeight="SemiBold"
                        >
                          <ArrowUp /> {item?.perIncrease}
                        </Label>
                        &nbsp;{" "}
                        <FormattedMessage
                          defaultMessage="average"
                          id="dashboard.labels.average"
                        />
                      </Label>
                    </Fragment>
                  }
                  labelColor={theme.palette.grey[500]}
                  boxProps={cardProps}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

const PayrollInfo = (props: any) => {
  const { navigate, isCardInfoLoading, theme, cardInfo, seasonSelected } =
    props;
  const { payrollToToday, lastPayrolls } = cardInfo || {};

  return (
    <Grid container mt="1.125rem" spacing={gridGap}>
      <Grid item xs={12} lg={4} xl={3}>
        <Box {...cardProps} display="flex" flexDirection="column" gap={2}>
          <Label color="grey-500" size="sm" fontWeight="SemiBold">
            {payrollToToday?.label}
          </Label>
          <Box
            p="0.5rem"
            bgcolor={theme.palette.grey[100]}
            padding="0.5rem"
            borderRadius={borderRadius}
          >
            <Display lineHeight="1.8" fontWeight="SemiBold" fontSize="1.5rem">
              {payrollToToday?.content}
            </Display>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
          >
            <BodyText color="grey-900" size="sm" fontWeight="Medium">
              <FormattedMessage
                defaultMessage="Starting: {startDate}"
                id="dashboard.labels.starting"
                values={{
                  startDate: payrollToToday?.startDate,
                }}
              />
            </BodyText>
            <Box
              display="flex"
              flexWrap="nowrap"
              padding="1px 9px"
              alignItems="center"
              justifyContent="center"
              border={`1px solid ${theme.palette.primary.dark}`}
              borderRadius="100px"
              py={0.5}
            >
              <Box
                mr="8px"
                display="inline-block"
                width="0.5rem"
                height="0.5rem"
                borderRadius="100%"
                bgcolor={theme.palette.primary.dark}
              />
              <BodyText size="xs" fontWeight="Medium">
                <FormattedMessage
                  defaultMessage="{days, plural, one {{days} day left} other {{days} days left}}"
                  id="dashboard.card.label.day"
                  values={{
                    days: payrollToToday?.daysLeft,
                  }}
                />
              </BodyText>
            </Box>
          </Box>

          <Button
            variant="text"
            onClick={() =>
              navigate(`/payroll/preview?seasonId=${seasonSelected?._id}`)
            }
            endIcon={<ArrowRight size="1rem" weight="bold" />}
            sx={{
              padding: "0 !important",
              background: "transparent !important",
              width: "fix-content",
              justifyContent: "left",
            }}
          >
            <FormattedMessage
              defaultMessage="Run Payroll"
              id="dashboard.button.runPayroll"
            />
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} lg={8} xl={9}>
        <Box {...cardProps}>
          <BodyText
            fontSize="1.125rem"
            mb="1rem"
            lineHeight="1"
            fontWeight="Medium"
          >
            <FormattedMessage
              defaultMessage="Recent Payrolls"
              id="dashboard.labels.recentPayrolls"
            />
          </BodyText>
          <Box display="flex" overflow="auto">
            <Grid container rowSpacing={gridGap} columnSpacing={gridGap}>
              {isCardInfoLoading ? (
                <Grid item xs={12}>
                  <LinearProgress color="secondary" />
                </Grid>
              ) : (
                lastPayrolls?.map((item: any, idx: number) => {
                  return (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={idx}>
                      <Box
                        px="1rem"
                        py="1.5rem"
                        bgcolor={theme.palette.grey[100]}
                        borderRadius={borderRadius}
                        display="flex"
                        flexDirection="column"
                        gap={4}
                      >
                        <BodyText size="sm" fontWeight="Medium">
                          <FormattedDate
                            value={new Date(item?.startDate)}
                            month="short"
                            day="2-digit"
                          />
                          &ensp;-&ensp;
                          <FormattedDate
                            value={new Date(item?.endDate)}
                            month="short"
                            day="2-digit"
                          />
                        </BodyText>

                        <Box display="flex" gap={2} flexWrap="wrap">
                          <Box
                            display="flex"
                            alignItems="center"
                            bgcolor="background.paper"
                            padding="0.5rem"
                            borderRadius={borderRadius}
                            flexWrap="nowrap"
                            flex={1}
                          >
                            <HandCoins size={16} />
                            <BodyText size="sm" fontWeight="Medium">
                              &ensp;{item?.season?.currency}&nbsp;
                              {item?.totals?.netAmount}
                            </BodyText>
                          </Box>

                          <Box
                            display="flex"
                            alignItems="center"
                            bgcolor="background.paper"
                            padding="0.5rem"
                            borderRadius={borderRadius}
                            flexWrap="nowrap"
                            flex={1}
                          >
                            <Plant size={16} />
                            <BodyText size="sm" fontWeight="Medium">
                              &ensp;{item?.totals?.collectedAmount}&nbsp;
                              {item?.season?.unit}
                            </BodyText>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashBoardLayout;
