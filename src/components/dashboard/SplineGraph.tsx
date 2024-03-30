import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material"

import { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';
import { useIntl } from "react-intl";

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
      <Grid container justifyContent="space-between" padding="1rem" rowGap="1rem">
        <Grid item>
          <Typography
            fontSize="1.125rem"
            fontWeight={600}
            variant="h2">
            Harvest Collection
          </Typography>
          <Typography
            fontSize="0.875"
            fontWeight={500}
            color={theme.palette.grey[600]}>
            Keep track of harvest collection over time
          </Typography>
        </Grid>
        <Grid item>
          <ButtonGroup color="secondary" variant="outlined" aria-label="Graph Filter Options">
            <Button
              onClick={() => setDaysDelta("all")} 
              sx={{bgcolor: daysDelta === "all" ? `${theme.palette.secondary.main}3D` : "transparent"}} 
              aria-label="All time">All time</Button>
            <Button 
              onClick={() => setDaysDelta(30)}
              sx={{bgcolor: daysDelta === 30 ? `${theme.palette.secondary.main}3D` : "transparent"}} 
              aria-label="30 days">30 days</Button>
            <Button
              onClick={() => setDaysDelta(7)}
              sx={{bgcolor: daysDelta === 7 ? `${theme.palette.secondary.main}3D` : "transparent"}} 
              aria-label="7 days">7 days</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      {
        !isLoading ? <Chart options={options} series={series} type="area" width="100%" height={220} /> : (
          <Grid
            p="1rem"
            container 
            height="220px" 
            alignItems="center">
            <Grid item xs={12}>
              <LinearProgress color="secondary" />
            </Grid>
          </Grid>
        )
      }
    </Box>
  )  
}

export default SplineGraph;
