import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import BasicHome from "layouts/BasicHome";
import useQueryCache from "hooks/useQueryCache";
import { useQuery } from "react-query";
import { getPayrollHistory, getSeasons } from "api/payroll";
import { CaretRight, User } from "@phosphor-icons/react";
import { useUser } from "context/UserProvider";
import { Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

const columns: GridColDef[] = [
  {
    field: "period",
    headerName: "Pay Period",
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <span>
          <FormattedDate
            value={params.row.startDate}
            month="short"
            day="numeric"
          />
          -
          <FormattedDate
            value={params.row.endDate}
            month="short"
            day="numeric"
          />
        </span>
      );
    },
  },
  {
    field: "totals.grossAmount",
    headerName: "Total net pay ($)",
    width: 150,
    renderCell: (params) => <span>{params.row.totals.grossAmount}</span>,
  },
  {
    field: "totals.collectedAmount",
    headerName: "Harvest Amount",
    width: 150,
    renderCell: (params) => (
      <span>
        {params.row.totals.collectedAmount} {params.row.season.unit}
      </span>
    ),
  },
  {
    field: "totals.deductions",
    headerName: "Deductions ($)",
    width: 150,
    renderCell: (params) => <span>{params.row.totals.deductions}</span>,
  },
  {
    field: "pickersCount",
    headerName: "Pickers",
    width: 150,
    renderCell: (params) => (
      <span>
        <User /> {params.row.pickersCount}
      </span>
    ),
  },
  {
    field: "endDate",
    headerName: "Pay Date",
    width: 150,
    renderCell: (params) => <span>{formatDate(params.value)}</span>,
  },
];

function formatDate(value: number | Date): string {
  const date = new Date(value);

  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  return `${month} ${day}`;
}

const Payroll = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uniqueSeasonId, setUniqueSeasonId] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useUser();
  const intl = useIntl();
  const [payrollData, setPayrollData] = useState([]);
  const { GET_QUERY_KEY } = useQueryCache("payrolls");

  const { isLoading } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: getPayrollHistory,
    onSuccess: (results) => {
      setPayrollData(results);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const selectedValue = event.target.value as string;
    const index = seasonOptions.findIndex(
      (option) => option.props.value === selectedValue
    );
    setSelectedIndex(index);
    setUniqueSeasonId([allSeasonId[index]]);
  };

  type Season = {
    _id: string;
  };
  
  type SeasonsData = {
    data: Season[];
  };
  
  const [seasonsData, setSeasonsData] = useState<SeasonsData | null>(null);
  
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const data = await getSeasons();
        setSeasonsData(data);
      } catch (error) {
        console.error(
          "Error:",
          (error as any).response.status,
          (error as any).response.statusText
        );
      }
    };
  
    fetchSeasons();
  }, []);


  let uniqueFarmId: string[] = [];
  
  if (user && user.farm && user.farm._id) {
    uniqueFarmId = [user.farm._id];
  }

  let seasonOptions: JSX.Element[] = [];
  let uniqueSeasonName: string[] = [];
  let allSeasonId: string[] = [];
  if (seasonsData && (seasonsData as any).data.length > 0) {
    uniqueSeasonName = [
      ...new Set((seasonsData.data as any[]).map((item: any) => item.name as string)),
    ];
    allSeasonId = [
  ...new Set((seasonsData.data as any[]).map((item: any) => item._id as string)),
];
    seasonOptions = uniqueSeasonName.map((name: string) => (
      <MenuItem key={name.toString()} value={name}>
        {name}
      </MenuItem>
    ));
  }

  const [selectedOption, setSelectedOption] = useState<unknown | null>(null);

  const handleSelectChange2 = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedOption(event.target.value as unknown);
    console.log(selectedOption);
  };

  const handleBothChanges = React.useCallback(
    (event: SelectChangeEvent<any>) => {
      handleSelectChange(event);
      handleSelectChange2(
        event.target.value as React.ChangeEvent<{ value: unknown }>
      );
    },
    [handleSelectChange, handleSelectChange2]
  );

  return (
    <BasicHome
      title={intl.formatMessage({ id: "payrolls", defaultMessage: "Payroll" })}
      subtitle={intl.formatMessage({
        id: "payrolls.subtitle",
        defaultMessage:
          "Create the payrolls and view previous payroll records.",
      })}
      breadcrumb={[
        { title: user.farm.name, href: "/" },
        {
          title: (
            <FormattedMessage id="sidebar.payrolls" defaultMessage="Payrolls" />
          ),
          href: "",
        },
      ]}
      actions={
        <Button
          variant="contained"
          onClick={() =>
            navigate("/payroll/preview", {
              state: { uniqueFarmId, uniqueSeasonId},
            })
          }
          disabled={uniqueSeasonId.length === 0}
        >
          Start a payroll
          <CaretRight size={25} />
        </Button>
      }
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1>Payroll History</h1>
        <Select
          value={
            selectedIndex !== null
              ? seasonOptions[selectedIndex]?.props.value
              : null
          }
          onChange={handleBothChanges}
        >
          <p>Season: </p>
          {seasonOptions}
        </Select>
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
          getRowId={(data) => data?._id}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
        />
      </Box>
    </BasicHome>
  );
};

export default Payroll;
