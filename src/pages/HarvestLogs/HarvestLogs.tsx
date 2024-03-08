import { Box, FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { getHarvestLogs } from "api/harvestLogs";
import { getPickerById } from "api/pickers";
import CreateHarvestLog from "components/harvestLogs/CreateHarvestLog";
import UpdateHarvestLog from "components/harvestLogs/UpdateHarvestLog";
import { useUser } from "context/UserProvider";
import { Dayjs } from "dayjs";
import useQueryCache from "hooks/useQueryCache";
import BasicHome from "layouts/BasicHome";
import { IHarvestLogResponse } from "project-2-types/dist/interface";
import { useState } from "react";
import { FormattedDate } from "react-intl";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import paths from "shared/paths";

const columns: GridColDef[] = [
  {
    field: "picker",
    renderHeader: () => "Picker",
    width: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams<IHarvestLogResponse>) =>
      params.row.picker?.name,
  },
  {
    field: "season",
    renderHeader: () => "Product",
    width: 200,
    valueGetter: (params: GridValueGetterParams<IHarvestLogResponse>) =>
      params.row.season?.product?.name,
  },
  { field: "collectedAmount", headerName: "Amount", width: 200 },
  { field: "totalDeduction", headerName: "Deductions", width: 200 },
  {
    field: "createdAt",
    renderHeader: () => "Date",
    width: 200,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <FormattedDate
          value={params.row.createdAt}
          year="numeric"
          month="short"
          day="numeric"
        />
      );
    },
  },
  {
    field: "action",
    headerName: "",
    width: 200,
    renderCell: (data: GridRenderCellParams<{ _id: string }>) => {
      return <UpdateHarvestLog harvestLogId={data.row._id} />;
    },
  },
];

const HarvestLogs = () => {
  const { GET_QUERY_KEY } = useQueryCache("harvestLogs");
  const { user } = useUser();
  const [search] = useSearchParams();

  const pickerId = search.get("pickerId") ?? null;

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [harvestLogs, setHarvestLogs] = useState<Array<IHarvestLogResponse>>(
    []
  );

  const [picker, setPicker] = useState<IHarvestLogResponse["picker"]>();

  const { isLoading } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: () => getHarvestLogs({ pickerId }),
    onSuccess: (results) => {
      setHarvestLogs(results);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { isLoading: isPickerLoading } = useQuery({
    queryKey: ["pickers", "harvest-logs", pickerId],
    queryFn: () => getPickerById(pickerId),
    enabled: !!pickerId,
    onSuccess: (results) => {
      if (results?._id) {
        setPicker(results);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <BasicHome
      title={picker ? picker?.name : "Harvest Log"}
      subtitle="Add and view picker’s daily collection data here."
      breadcrumb={[
        { title: user.farm.name, href: "/" },
        { title: "Harvest Log", href: paths.harvestLogs },
        ...(picker ? [{ title: picker?.name, href: "#" }] : []),
      ]}
      actions={<CreateHarvestLog />}
    >
      <Box display="flex" justifyContent="space-between">
        <FormControl>
          <Box display="flex" gap={3}>
            <DatePicker
              label="Start Date"
              value={startDate}
              slotProps={{ textField: { size: "small" } }}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              slotProps={{ textField: { size: "small" } }}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
            />
          </Box>
        </FormControl>

        <FormControl>
          <OutlinedInput
            placeholder="Search"
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlass />
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
      <Box display="flex" flexGrow={1} pb={3}>
        <DataGrid
          rows={harvestLogs ?? []}
          columns={columns}
          loading={isLoading || isPickerLoading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
            columns: {
              columnVisibilityModel: {
                picker: !pickerId,
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

export default HarvestLogs;
