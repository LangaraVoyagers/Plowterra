import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Typography,
} from "@mui/material"

import Chart from 'react-apexcharts';
import { IApexChartProps } from "./DashboardLayout";

const SplineGraph = (props: IApexChartProps) => {
  return (
    <Box>
      <Grid container justifyContent="space-between" rowSpacing="1rem">
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
            color="#57534E">
            Keep track of harvest collection over time
          </Typography>
        </Grid>
        <Grid item>
          <ButtonGroup variant="outlined" aria-label="Graph Filter">
            <Button>All time</Button>
            <Button>30 days</Button>
            <Button>7 days</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Chart options={props.options} series={props.series} type="area" width="100%" height={220} />
    </Box>
  )  
}

export default SplineGraph;
