import { Box, FormControl, useMediaQuery, useTheme } from "@mui/material"
import {
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  useIntl,
} from "react-intl";
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import {
  IHarvestLogResponse,
  ISeasonResponse,
} from "project-2-types/dist/interface";
import dayjs, { Dayjs } from "dayjs";

import BasicHome from "layouts/BasicHome";
import { BodyText } from "ui/Typography";
import CreateHarvestLog from "components/harvestLogs/CreateHarvestLog";
import DataTable from "ui/DataTable";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { FileText } from "@phosphor-icons/react";
import FiltersDrawer from "components/harvestLogs/FiltersDrawer";
import SeasonFilterDataGrid from "components/SeasonFilterDataGrid";
import UpdateHarvestLog from "components/harvestLogs/UpdateHarvestLog";
import { getHarvestLogs } from "api/harvestLogs"
import { getPickerById } from "api/pickers"
import paths from "shared/paths";
import { useAlert } from "context/AlertProvider";
import { useQuery } from "react-query";
import useQueryCache from "hooks/useQueryCache";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useUser } from "context/UserProvider";

const columns = (currency: string): GridColDef[] => [
  {
    field: "picker",
    renderHeader: () => (
      <FormattedMessage
        id="harvest.logs.table.column.picker"
        defaultMessage="Picker"
      />
    ),
    minWidth: 150,
    flex: 0.5,
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
    minWidth: 120,
    flex: 0.5,
    renderCell: (params) => {
      return (
        <Box>
          <BodyText size="md">{params.row.picker?.name}</BodyText>
          <BodyText size="xs" color="grey-500">
            <FormattedDate value={params.row.createdAt} dateStyle="short" />-{" "}
            {params.row.season?.product?.name}
          </BodyText>
        </Box>
      );
    },
  },
  {
    field: "product",
    flex: 0.25,
    renderHeader: () => (
      <FormattedMessage
        id="harvest.logs.table.column.product"
        defaultMessage="Product"
      />
    ),
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
    flex: 0.25,
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
    flex: 0.25,
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
    flex: 0.25,
    align: "center",
    renderCell: (params: GridRenderCellParams) => {
      return <FormattedDate value={params.row.createdAt} dateStyle="medium" />;
    },
  },
  {
    field: "actions",
    renderHeader: () => (
      <FormattedMessage id="datagrid.column.actions" defaultMessage="Actions" />
    ),
    headerAlign: "center",
    align: "center",
    width: 110,
    renderCell: (data: GridRenderCellParams<{ _id: string }>) => {
      return <UpdateHarvestLog harvestLogId={data.row._id} />;
    },
  },
];

const HarvestLogs = () => {
  const { user, defaultSeason } = useUser();
  const intl = useIntl();
  const { showAlert } = useAlert();

  const [search] = useSearchParams();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));

  const pickerId = search.get("pickerId") ?? null;

  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().startOf("week")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
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
        seasonId: selectedSeason?._id || defaultSeason,
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
      title={
        picker
          ? picker?.name
          : intl.formatMessage({
              id: "harvest.log",
              defaultMessage: "Harvest Log",
            })
      }
      subtitle={intl.formatMessage({
        id: "harvest.log.subtitle",
        defaultMessage: "Add and view picker's daily collection data here.",
      })}
      breadcrumb={[
        { title: user.farm.name, href: "/" },
        {
          title: (
            <FormattedMessage
              id="sidebar.harvest_log"
              defaultMessage="Harvest Log"
            />
          ),
          href: paths.harvestLogs,
        },
        ...(picker ? [{ title: picker?.name, href: "#" }] : []),
      ]}
      actions={!!desktop && <CreateHarvestLog />}
    >
      {!!desktop && (
        <Box display="flex" justifyContent="space-between">
          <FormControl>
            <Box display="flex" gap={3}>
              <DatePicker
                label={intl.formatMessage({
                  id: "harvest.logs.start.date",
                  defaultMessage: "Start Date",
                })}
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
                label={intl.formatMessage({
                  id: "harvest.logs.end.date",
                  defaultMessage: "End Date",
                })}
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

          <SeasonFilterDataGrid
            defaultFirst={false}
            onChange={setSelectedSeason}
          />
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
            icon: <FileText width="100%" height="100%" />,
            title: intl.formatMessage({
              id: "harvest.log.empty.state.title",
              defaultMessage: `It seems you haven't added any harvest entry yet.`,
            }),
            subtitle: intl.formatMessage({
              id: "harvest.log.empty.state.subtitle",
              defaultMessage: `Let's add your first harvest entry!`,
            }),
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                picker: !pickerId && !!desktop,
                pickerList: !desktop,
                product: !!tablet,
                deductions: !!desktop,
                createdAt: !!tablet,
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
