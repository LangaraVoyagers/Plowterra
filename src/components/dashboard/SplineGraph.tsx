import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  LinearProgress,
  useTheme,
} from "@mui/material"
import { FormattedMessage, useIntl } from "react-intl";

import { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';
import { Display } from "ui/Typography";

const SplineGraph = (props: any) => {
  const theme = useTheme();
  const intl = useIntl();
  const {
    mode,
    series,
    unitName,
    daysDelta,
    setDaysDelta,
    isLoading
  } = props;

  const options: ApexOptions = {
    theme: {
      mode: mode
    },
    chart: {
      height: 350,
      type: "area",
      background: "transparent",
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1,
      colors: [theme.palette.primary.dark]
    },
    fill: {
      colors: [theme.palette.primary.dark]
    },
    xaxis: {
      title: {
        text: intl.formatMessage({defaultMessage:"Harvest Date", id:"dashboard.graph.xaxisLabel"}),
        style: {
          fontFamily: "PlusJakartaSans, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
          fontSize: "0.75rem",
          fontWeight: 500
        }
      }
    },
    yaxis: {
      title:{
        text: `${intl.formatMessage({defaultMessage:"Harvest Amount (in", id:"dashboard.graph.yaxisLabel"})} ${ unitName })`,
        style: {
          fontFamily: "PlusJakartaSans, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
          fontSize: "0.75rem",
          fontWeight: 500
        }
      }
    },
    tooltip: {
      y: {
        formatter(value) {
          return `${ value } ${ unitName }`
        },
      }
    },
    colors: [theme.palette.primary.dark]
  }

  return (
    <Box>
      <Grid
        container
        justifyContent="space-between"
        padding="1rem"
        rowGap="1rem"
      >
        <Grid item>
          <Display
            lineHeight="1.6"
            fontSize="1.125rem"
            fontWeight="SemiBold"
            variant="h2"
          >
            <FormattedMessage
              defaultMessage="Harvest Collection"
              id="dashboard.graph.title"
            />
          </Display>
          <Display
            lineHeight="1.5"
            fontSize="0.875rem"
            fontWeight="Medium"
            color="grey-600"
          >
            <FormattedMessage
              defaultMessage="Keep track of harvest collection over time"
              id="dashboard.graph.label"
            />
          </Display>
        </Grid>
        <Grid item>
          <ButtonGroup
            color="secondary"
            variant="outlined"
            aria-label="Graph Filter Options"
          >
            <Button
              onClick={() => setDaysDelta("all")}
              sx={{
                bgcolor:
                  daysDelta === "all"
                    ? `${theme.palette.secondary.main}3D`
                    : "transparent",
              }}
              aria-label={intl.formatMessage({
                id: "dashboard.graph.filter.all_time",
              })}
            >
              <FormattedMessage
                id="dashboard.graph.filter.all_time"
                defaultMessage="All time"
              />{" "}
            </Button>
            <Button
              onClick={() => setDaysDelta(30)}
              sx={{
                bgcolor:
                  daysDelta === 30
                    ? `${theme.palette.secondary.main}3D`
                    : "transparent",
              }}
              aria-label={intl.formatMessage({
                id: "dashboard.graph.filter.30_days",
              })}
            >
              <FormattedMessage
                id="dashboard.graph.filter.30_days"
                defaultMessage="30 days"
              />
            </Button>
            <Button
              onClick={() => setDaysDelta(7)}
              sx={{
                bgcolor:
                  daysDelta === 7
                    ? `${theme.palette.secondary.main}3D`
                    : "transparent",
              }}
              aria-label={intl.formatMessage({
                id: "dashboard.graph.filter.7_days",
              })}
            >
              <FormattedMessage
                id="dashboard.graph.filter.7_days"
                defaultMessage="7 days"
              />
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      {!isLoading ? (
        <Chart
          options={options}
          series={series}
          type="area"
          width="100%"
          height={220}
        />
      ) : (
        <Grid p="1rem" container height="220px" alignItems="center">
          <Grid item xs={12}>
            <LinearProgress color="secondary" />
          </Grid>
        </Grid>
      )}
    </Box>
  );  
}

export default SplineGraph;
