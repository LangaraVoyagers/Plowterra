import { Box, FormControl, useMediaQuery, useTheme } from "@mui/material"
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { getHarvestLogs } from "api/harvestLogs"
import { getPickerById } from "api/pickers"
import SeasonFilterDataGrid from "components/SeasonFilterDataGrid";
import CreateHarvestLog from "components/harvestLogs/CreateHarvestLog";
import FiltersDrawer from "components/harvestLogs/FiltersDrawer";
import UpdateHarvestLog from "components/harvestLogs/UpdateHarvestLog";
import { useAlert } from "context/AlertProvider";
import { useUser } from "context/UserProvider";
import { Dayjs } from "dayjs";
import useQueryCache from "hooks/useQueryCache";
import BasicHome from "layouts/BasicHome";
import {
  IHarvestLogResponse,
  ISeasonResponse,
} from "project-2-types/dist/interface";
import { useState } from "react";
import {
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  useIntl,
} from "react-intl";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import paths from "shared/paths";
import DataTable from "ui/DataTable";
import { BodyText } from "ui/Typography";
import EmptyHarvestLog from "../../assets/icons/EmptyHarvestLog.svg";

const columns = (currency: string): GridColDef[] => [
  // {
  //   field: "index",
  //   renderHeader: () => (
  //     <FormattedMessage
  //       id="harvest.logs.table.columns.no.header"
  //       defaultMessage="No"
  //     />
  //   ),
  //   width: 50,
  //   valueGetter: (params) => {
  //     return params.row.index + 1;
  //   },
  // },
  {
    field: "picker",
    renderHeader: () => (
      <FormattedMessage
        id="harvest.logs.table.column.picker"
        defaultMessage="Picker"
      />
    ),
    minWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams<IHarvestLogResponse>) =>
      params.row.picker?.name,
  },
  {
    field: "pickerList",
    renderHeader: () => (
      <FormattedMessage
        id="harvest.logs.table.column.picker_list"
        defaultMessage="Picker List"
      />
    ),
    minWidth: 150,
    flex: 1,
    renderCell: (params) => {
      return (
        <Box>
          <BodyText size="md">{params.row.picker?.name}</BodyText>
          <BodyText size="xs" color="grey-500">
            <FormattedDate
              value={params.row.createdAt}
              day="numeric"
              month="long"
              year="numeric"
            />
            - {params.row.season?.product?.name}
          </BodyText>
        </Box>
      );
    },
  },
  {
    field: "product",
    renderHeader: () => (
      <FormattedMessage
        id="harvest.logs.table.column.product"
        defaultMessage="Product"
      />
    ),
    width: 200,
    valueGetter: (params: GridValueGetterParams<IHarvestLogResponse>) =>
      params.row.season?.product?.name,
  },
  {
    field: "amount",
    renderHeader: () => (
      <FormattedMessage
        id="harvest.logs.table.column.amount"
        defaultMessage="Amount"
      />
    ),
    width: 100,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <BodyText>
          {params.row.collectedAmount} {params.row.season?.unit?.name}
        </BodyText>
      );
    },
  },
  {
    field: "deductions",
    renderHeader: () => (
      <FormattedMessage
        id="harvest.logs.table.column.deductions"
        defaultMessage="Deduct {currency}"
        values={{ currency: currency ? `(${currency})` : "" }}
      />
    ),
    width: 200,
    headerAlign: "right",
    align: "right",
    renderCell: (params: GridRenderCellParams) => {
      return <FormattedNumber value={params.row.totalDeduction} />;
    },
  },
  {
    field: "createdAt",
    headerAlign: "center",
    renderHeader: () => (
      <FormattedMessage
        id="harvest.logs.table.column.created_at"
        defaultMessage="Date"
      />
    ),
    minWidth: 200,
    flex: 1,
    align: "center",
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
    field: "actions",
    renderHeader: () => (
      <FormattedMessage id="datagrid.column.actions" defaultMessage="Actions" />
    ),
    headerAlign: "center",
    align: "center",
    width: 200,
    renderCell: (data: GridRenderCellParams<{ _id: string }>) => {
      return <UpdateHarvestLog harvestLogId={data.row._id} />;
    },
  },
];

const HarvestLogs = () => {
  const { user } = useUser();
  const intl = useIntl();
  const { showAlert } = useAlert();

  const [search] = useSearchParams();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const pickerId = search.get("pickerId") ?? null;

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [searchTable, setSearchTable] = useState<string>();

  const [harvestLogs, setHarvestLogs] = useState<Array<IHarvestLogResponse>>(
    []
  );
  const [selectedSeason, setSelectedSeason] = useState<ISeasonResponse>();
  const [picker, setPicker] = useState<IHarvestLogResponse["picker"]>();

  const { GET_QUERY_KEY } = useQueryCache("harvestLogs");

  const { isLoading } = useQuery({
    queryKey: [
      ...GET_QUERY_KEY,
      pickerId,
      startDate,
      endDate,
      selectedSeason?._id,
    ],
    queryFn: () =>
      getHarvestLogs({
        pickerId,
        startDate: startDate ? startDate?.toDate().getTime() : undefined,
        endDate: endDate ? endDate?.toDate().getTime() : undefined,
        seasonId: selectedSeason?._id,
      }),
    onSuccess: (results) => {
      setHarvestLogs(results);
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "harvest.logs.get.harvest.logs.error",
          defaultMessage: "No harvest logs found",
        }),
        "error"
      );
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
      showAlert(
        intl.formatMessage({
          id: "harvest.logs.get.pickers.error",
          defaultMessage: "No picker found",
        }),
        "error"
      );
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
      actions={!!desktop && <CreateHarvestLog />}
    >
      {!!desktop && (
        <Box display="flex" justifyContent="space-between">
          <FormControl>
            <Box display="flex" gap={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                slotProps={{
                  field: { clearable: true, onClear: () => setStartDate(null) },
                  textField: { size: "small" },
                }}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                slotProps={{
                  field: { clearable: true, onClear: () => setEndDate(null) },
                  textField: { size: "small" },
                }}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
              />
            </Box>
          </FormControl>

          <SeasonFilterDataGrid onChange={setSelectedSeason} />
        </Box>
      )}

      {!desktop && (
        <Box display="flex" justifyContent="space-between">
          <FiltersDrawer
            startDate={startDate}
            endDate={endDate}
            selectedSeason={selectedSeason}
            applyFilter={(data) => {
              setSelectedSeason(data.season);
              setStartDate(data.startDate);
              setEndDate(data.endDate);
              setSearchTable(data.search);
            }}
          />

          <CreateHarvestLog />
        </Box>
      )}

      <Box display="flex" flexGrow={1}>
        <DataTable
          rows={harvestLogs ?? []}
          columns={columns(selectedSeason?.currency.name ?? "")}
          loading={isLoading || isPickerLoading}
          filterModel={{
            items: [],
            quickFilterValues: searchTable ? searchTable?.split(" ") : [],
          }}
          emptyState={{
            image: EmptyHarvestLog,
            title: intl.formatMessage({
              id: "harvest.log.empty.state.title",
              defaultMessage: `It seems  you haven't added any harvest entry yet.`,
            }),
            subtitle: intl.formatMessage({
              id: "harvest.log.empty.state.subtitle",
              defaultMessage: ` Let's add your first harvest entry!`,
            }),
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                picker: !pickerId && !!desktop,
                pickerList: !desktop,
                product: !!desktop,
                deductions: !!desktop,
                createdAt: !!desktop,
              },
            },
          }}
          getRowId={(data) => data?._id}
          disableRowSelectionOnClick
        />
      </Box>
    </BasicHome>
  );
};

export default HarvestLogs
