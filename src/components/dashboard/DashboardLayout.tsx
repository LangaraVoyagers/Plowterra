import {
  ArrowRight,
  ArrowUp,
  FilePlus,
  HandCoins,
  Plant
} from "@phosphor-icons/react";
import {
  Box,
  BoxProps,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { Fragment, ReactNode } from "react";
import Select, { StylesConfig } from "react-select";
import { getDate, getGreeting } from "shared/date-helpers";

import { ApexOptions } from "apexcharts";
import { FormattedMessage } from "react-intl";
import SplineGraph from "./SplineGraph";
import { useUser } from "context/UserProvider";
import { useIntl } from 'react-intl';

const gridGap = "1.5rem";

const bgHighlight = "#F5F5F4";
const borderRadius = "0.5rem";
const seperator = { xl: "2px solid #D7D3D0" };

const cardProps = {
  backgroundColor: "white",
  borderRadius,
  padding: "1.5rem"
}

const reactSelectStyles: StylesConfig = {
  control: base => ({
    ...base,
    height: 54,
    width: 240,
    borderRadius
  }),
  option: base => ({
    ...base,
  }),
  menu: base => ({
    ...base,
    width: 240
  }),
  indicatorSeparator: () => ({display:'none'})
};

const DashBoardLayout = (props: any) => {
  const { user } = useUser();
  const USER_GREETING = getGreeting();
  const FORMATTED_DATE = getDate();
  const intl = useIntl();

  return (
    <Box padding={{md: "2rem"}}>
      <Grid container mb="2rem" rowSpacing={gridGap} justifyContent="space-between" alignItems="flex-end">
        <Grid item>
          <Typography 
            fontSize="2rem" 
            fontWeight={700}
            variant="h1">
            { USER_GREETING }, { user.name }
          </Typography>
          <Typography>
            <FormattedMessage id="dashboard.greeting" defaultMessage="Today is" />
            &ensp;
            <Typography
              px="5px"
              bgcolor="white"
              display="inline-block" 
              border="1px solid #D7D3D0"
              borderRadius="4px">
              { FORMATTED_DATE }
            </Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" endIcon={<FilePlus />}>
            {intl.formatMessage({ id: "dashboard.addHarvestEntry", defaultMessage: "Add Harvest Entry",  })}
          </Button>
        </Grid>
      </Grid>
      <HarvestInfo seasonOptions={props?.seasonOptions} />
      <MidSectionInfo series={props?.graphSeries} options={props?.graphOptions} />
      <PayrollInfo />
    </Box>
  )
}

interface ICardLayout {
  label: string;
  content: string | ReactNode | undefined;
  boxProps?: BoxProps;
}

export interface IApexChartProps {
  series: any;
  options: ApexOptions;
}

const CardLayout = (props: ICardLayout) => {
  return (
    <Box {...props?.boxProps}>
      <Typography
        color="#79716B"
        fontSize="1.14rem"
        fontWeight={600}>{ props.label }</Typography>
      <Typography 
        fontWeight={600} 
        fontSize="1.5rem" 
        mt="1.3rem">
        { props.content }
      </Typography>
    </Box>
  )
}

const HarvestInfo = (props: any) => {
  const intl = useIntl();
  return (
    <Grid {...cardProps} xs={12}>
      <Box mb="1.5rem">
        <Select 
          options={props?.seasonOptions} 
          styles={reactSelectStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
            ...theme.colors,
              text: "white",
              primary50: "#15A260",
              primary25: "#C5E8D7",
              primary: "#055E40",
            },
          })} />
      </Box>
      <Grid container rowSpacing={{ xs: "2rem" }} columnSpacing={{ lg: "2rem" }}>
        <Grid item xs={12} md={6} lg={3} xl={2.25}>
          <CardLayout 
            label= {intl.formatMessage({ id: "dashboard.product", defaultMessage: "PRODUCT" })}
            content="Coffee" 
            boxProps={{
              borderRight: seperator
            }} />
        </Grid>

        <Grid item xs={12} md={6} lg={3} xl={2.25}>
          <CardLayout 
            label= {intl.formatMessage({ id: "dashboard.startDate", defaultMessage: "START DATE" })}
            content="01 Jan, 2024" 
            boxProps={{
              borderRight: seperator
            }} />
        </Grid>

        <Grid item xs={12} md={6} lg={3} xl={2.25}>
          <CardLayout 
            label= {intl.formatMessage({ id: "dashboard.pricePerUnit", defaultMessage: "PRICE PER UNIT" })}
            content="$ 3" 
            boxProps={{
              borderRight: seperator
            }} />
        </Grid>

        <Grid item xs={12} md={6} lg={3} xl={2.25}>
          <CardLayout 
            label= {intl.formatMessage({ id: "dashboard.harvestDays", defaultMessage: "HARVEST DAYS" })}
            content="34"
            boxProps={{
              borderRight: seperator
            }} />
        </Grid>

        <Grid item xs={12} md={6} lg={3} xl={2.25}>
          <CardLayout 
            label="TOTAL HARVEST AMOUNT" 
            content="1,463 kg" />
        </Grid>
      </Grid>
    </Grid>
  )
}

const MidSectionInfo = (props: IApexChartProps) => {
  return (    
    <Grid container pt={gridGap} columnSpacing={gridGap} rowSpacing={{md: gridGap}} alignItems="stretch">
      <Grid item xs={12} md={12} xl={9}>
        <Box {...cardProps}>
          <SplineGraph series={props.series} options={props.options} />
        </Box>
      </Grid>
      <Grid item xs={12} md={12} xl={3} height="100%">
          <Grid container height="100%" spacing={gridGap} alignItems="stretch">
            <Grid item xs={12} md={6} lg={6} xl={12}>
              <CardLayout 
                label="TOTAL HARVEST AMOUNT"
                content={
                  <Fragment>
                    <span>$ 16,382</span>
                    <Typography mt="1rem" color="#79716B" display="flex" alignItems="center">
                      <Typography color="#15A260" fontSize="0.875rem" fontWeight={600} variant="caption">
                        <ArrowUp /> 15%
                      </Typography>
                      &nbsp; average
                    </Typography>
                  </Fragment>
                } 
                boxProps={cardProps} />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={12}>
              <CardLayout 
                label="TOTAL HARVEST AMOUNT" 
                content={
                  <Fragment>
                    <span>$ 16,382</span>
                    <Typography mt="1rem" color="#79716B" display="flex" alignItems="center">
                      <Typography color="#15A260" fontSize="0.875rem" fontWeight={600} variant="caption">
                        <ArrowUp /> 15%
                      </Typography>
                      &nbsp; average
                    </Typography>
                  </Fragment>
                } 
                boxProps={cardProps} />
            </Grid>
          </Grid>
      </Grid>
    </Grid>
  )
}

const PayrollInfo = () => {
  return (
    <Grid container mt="2.25rem" spacing={gridGap}>
      <Grid item xs={12} lg={3}>
        <Box {...cardProps}>
          <Typography
            color="#79716B"
            fontSize="1.14rem"
            fontWeight={600}>PAYROLL TO THIS DAY</Typography>
          <Box
            p="0.5rem"
            mt="1.3rem"
            bgcolor="#F5F5F4"
            padding="0.5rem"
            borderRadius={borderRadius}>
            <Typography
              m="0"
              fontWeight={600} 
              fontSize="1.5rem">
              $ 1,472
            </Typography>
          </Box>
          <Box display="flex" mt="1.0625rem" alignItems="center" justifyContent="space-between">
            <Typography
              color="#1C1917"
              fontSize="0.875rem"
              fontWeight={500}>Starting: Feb 15</Typography>
            <Box 
              display="inline-flex"
              padding="1px 9px"
              alignItems="center"
              justifyContent="center"
              border="1px solid #17B26A"
              borderRadius="100px"
              width="5.437"
              height="1.375">
              <Typography
                color="#17B26A"
                fontSize="0.75rem"
                fontWeight={500}>
                <Box mr="8px" display="inline-block" width="0.5rem" height="0.5rem" borderRadius="100%" bgcolor="#17B26A" />
                3 days left
              </Typography>
            </Box>
          </Box>
          <button style={{ padding: 0, backgroundColor: "transparent", border: "none" }}>
            <Typography
              mt="1.2rem"
              color="#055E40"
              display="flex"
              alignItems="center"
              fontWeight={500}>
              Run Payroll&ensp;<ArrowRight />
            </Typography>
          </button>
        </Box>
      </Grid>
      <Grid item xs={12} lg={9}>
        <Box {...cardProps}>
          <Typography fontSize="1rem" fontWeight={500}>
            Recent Payrolls
          </Typography>
          <Grid container rowSpacing={gridGap} columnSpacing={gridGap}>
            <Grid item xs={12} md={6} lg={4}>
              <Box px="1rem" py="1.5rem" bgcolor={bgHighlight} borderRadius={borderRadius}>
                <Typography fontSize="0.875rem" fontWeight={500}>
                  Feb 01 - Feb 15
                </Typography>
                <Grid container mt="1rem" rowSpacing="1rem" columnSpacing="1rem">
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <HandCoins size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;$8,384</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <Plant size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;928kg</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <Box px="1rem" py="1.5rem" bgcolor={bgHighlight} borderRadius={borderRadius}>
                <Typography fontSize="0.875rem" fontWeight={500}>
                  Feb 01 - Feb 15
                </Typography>
                <Grid container mt="1rem" rowSpacing="1rem" columnSpacing="1rem">
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <HandCoins size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;$8,384</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <Plant size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;928kg</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box px="1rem" py="1.5rem" bgcolor={bgHighlight} borderRadius={borderRadius}>
                <Typography fontSize="0.875rem" fontWeight={500}>
                  Feb 01 - Feb 15
                </Typography>
                <Grid container mt="1rem" rowSpacing="1rem" columnSpacing="1rem">
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <HandCoins size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;$8,384</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <Plant size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;928kg</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}

export default DashBoardLayout;
