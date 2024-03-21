import { Box, Button, Drawer, IconButton, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Funnel, X } from "@phosphor-icons/react";
import SearchDataGrid from "components/SearchDataGrid";
import SeasonFilterDataGrid from "components/SeasonFilterDataGrid";
import { Dayjs } from "dayjs";
import { ISeasonResponse } from "project-2-types";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { BodyText } from "ui/Typography";

type FiltersDrawerProps = {
  startDate: Dayjs | null;
  selectedSeason?: ISeasonResponse;
  endDate: Dayjs | null;

  applyFilter: (data: {
    season?: ISeasonResponse;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    search?: string;
  }) => void;
};
const FiltersDrawer = ({
  startDate: defaultStartDate = null,
  endDate: defaultEndDate = null,
  selectedSeason: defaultSeason,
  applyFilter,
}: FiltersDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<
    ISeasonResponse | undefined
  >(defaultSeason);
  const [search, setSearch] = useState<string>();
  const [startDate, setStartDate] = useState<Dayjs | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(defaultEndDate);

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => setOpen(true)}
        endIcon={<Funnel size="1rem" />}
      >
        Filters
      </Button>
      <Drawer open={open}>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          p="1.5rem"
          gap="2rem"
          sx={({ palette }) => {
            return { background: palette.background.default };
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap="0.5rem" alignItems="center">
              <BodyText component="h1" fontWeight="Medium" size="md">
                Filters
              </BodyText>
              <Funnel size="1.2rem" />
            </Box>

            <IconButton onClick={() => setOpen(false)}>
              <X size="1.5rem" />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection="column" gap="1.5rem" flex={1}>
            <Field>
              <BodyText component="label">
                <FormattedMessage
                  id="harvest.log.filters.drawer.harvest_season.label"
                  defaultMessage="Harvest Season"
                />
              </BodyText>
              <SeasonFilterDataGrid
                defaultSeasonId={selectedSeason?._id}
                defaultFirst={false}
                onChange={setSelectedSeason}
              />
            </Field>

            <Field>
              <BodyText component="label">
                <FormattedMessage
                  id="harvest.log.filters.drawer.start_date.label"
                  defaultMessage="Start Date"
                />
              </BodyText>
              <DatePicker
                value={startDate}
                slotProps={{
                  field: { clearable: true, onClear: () => setStartDate(null) },
                  textField: { size: "small" },
                }}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
              />
            </Field>

            <Field>
              <BodyText component="label">
                <FormattedMessage
                  id="harvest.log.filters.drawer.end_date.label"
                  defaultMessage="End Date"
                />
              </BodyText>
              <DatePicker
                value={endDate}
                slotProps={{
                  field: { clearable: true, onClear: () => setEndDate(null) },
                  textField: { size: "small" },
                }}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
              />
            </Field>

            <Field>
              <BodyText component="label">
                <FormattedMessage
                  id="harvest.log.filters.drawer.picker.label"
                  defaultMessage="Picker"
                />
              </BodyText>
              <SearchDataGrid applySearch={setSearch} searchValue={search} />
            </Field>
          </Box>
          <Box display="flex" gap="2rem" justifyContent="space-between">
            <Button
              onClick={() => {
                applyFilter({
                  endDate: null,
                  startDate: null,
                  search: "",
                  season: undefined,
                });

                setSelectedSeason(undefined);
                setEndDate(null);
                setStartDate(null);
                setSearch("");
                setOpen(false);
              }}
            >
              <FormattedMessage
                id="harvest.log.filters.drawer.reset.button"
                defaultMessage="Reset Filters"
              />
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                applyFilter({
                  endDate,
                  startDate,
                  search,
                  season: selectedSeason,
                });
                setOpen(false);
              }}
            >
              <FormattedMessage
                id="harvest.log.filters.drawer.apply.button"
                defaultMessage="Apply Filters"
              />
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

const Field = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default FiltersDrawer;
