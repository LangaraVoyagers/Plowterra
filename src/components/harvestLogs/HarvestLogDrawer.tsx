import * as React from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerProps,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  TextField,
  Autocomplete,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import { createHarvestLog } from "api/harvestLogs";
import useQueryCache from "hooks/useQueryCache";
import { useAlert } from "context/AlertProvider";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { IHarvestLogResponse } from "project-2-types/lib/harvestLog";
import { getPickers } from "api/pickers";
import { IPicker } from "project-2-types/lib/pickers";
import { getSeasons } from "api/seasons";
import { useState } from "react";

interface IHarvestLogForm {
  season: { id: string; label: string };
  picker: { id: string; label: string };
  collectedAmount: number;
  productName?: string;
  seasonDeductionsIds: Array<string>;
  notes?: string;
}

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const deductions = ["Transport", "Meal", "Storage", "Other"]; //TODO: get actual data

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type HarvestLogDrawerProps = DrawerProps & {
  harvestLogId?: string;
  dismiss: () => void;
};
const HarvestLogDrawer = ({
  dismiss,
  harvestLogId,
  ...props
}: HarvestLogDrawerProps) => {
  const { showAlert } = useAlert();
  const { CREATE_MUTATION_KEY } = useQueryCache("harvestLosgs", harvestLogId);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<IHarvestLogForm>();

  const [deductionName, setdeductionName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof deductionName>) => {
    const {
      target: { value },
    } = event;
    setdeductionName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const { GET_QUERY_KEY: PICKERS_QUERY_KEY } = useQueryCache("pickers");

  const [pickers, setPickers] = React.useState<Array<IPicker>>([]);

  useQuery({
    queryKey: PICKERS_QUERY_KEY,
    queryFn: getPickers,
    onSuccess: (results) => {
      setPickers(results);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { GET_QUERY_KEY: SEASONS_QUERY_KEY } = useQueryCache("seasons");
  const {
    // GET_QUERY_KEY: HARVEST_LOG_QUERY_KEY,
    createCache: createHarvestLogCache,
  } = useQueryCache("harvestLogs");

  const [seasons, setSeasons] = useState<
    Array<{ _id: string; name: string; product: { name: string } }>
  >([]);

  useQuery({
    queryKey: SEASONS_QUERY_KEY,
    queryFn: getSeasons,
    onSuccess: (results) => {
      setSeasons(results);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const selectedProduct = watch("productName");

  const { mutate: saveHarvestLogMutation } = useMutation({
    mutationKey: CREATE_MUTATION_KEY,
    mutationFn: createHarvestLog,
    onSuccess: (result) => {
      handleCreateSuccess(result);
    },
    onError: () => {
      showAlert("Oops! The harvest log couldn't be saved.");
    },
  });

  const onCreateHarvestLogClose = () => {
    reset();
    dismiss();
  };

  const handleCreateSuccess = (
    created: IHarvestLogResponse & { _id: string }
  ) => {
    createHarvestLogCache(created);
    showAlert(`Harvest Log created successfully`);
    onCreateHarvestLogClose();
  };

  const onSubmit = (data: IHarvestLogForm) => {
    saveHarvestLogMutation({
      farmId: "65d703cf9a00b1a671609458", //TODO: get actual farmId
      collectedAmount: data.collectedAmount,
      pickerId: data.picker.id,
      seasonId: data.season.id,
      seasonDeductionIds: data.seasonDeductionsIds,
      notes: data.notes, //TODO add to endpoint
    });
  };

  const harvestLogForm = (
    <Box
      display="flex"
      flexDirection="column"
      padding="3rem"
      gap={3}
      width={600}
    >
      <Typography variant="h1">Add Harvest Log</Typography>
      <Controller
        control={control}
        name="season"
        render={({ field: { onChange, value } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <Autocomplete
                id="harvest-season-combo-box"
                options={seasons.map(
                  (season: { _id: string; name: string }) => ({
                    id: season._id,
                    label: season?.name,
                  })
                )}
                value={value}
                onChange={(_, newValue) => {
                  onChange(newValue);

                  setValue(
                    "productName",
                    seasons?.find(
                      (s: { _id: string }) => s._id === newValue?.id
                    )?.product?.name ?? ""
                  );
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <div>
                    <InputLabel htmlFor="harvest-log-season">
                      Harvest Season Name*
                    </InputLabel>
                    <TextField {...params} id="harvest-log-season" />
                  </div>
                )}
              />
            </Box>
          );
        }}
      />

      <Box display="flex" flexDirection="column" gap={1}>
        <InputLabel htmlFor="harvest-log-date">Date*</InputLabel>
        <OutlinedInput id="harvest-log-date" value={formattedDate} disabled />
      </Box>

      <Controller
        control={control}
        name="picker"
        render={({ field: { onChange, value } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <Autocomplete
                id="picker-combo-box"
                value={value}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                options={pickers.map((picker) => ({
                  id: picker._id,
                  label: picker?.name,
                }))}
                renderInput={(params) => (
                  <div>
                    <InputLabel htmlFor="harvest-log-picker">
                      Picker*
                    </InputLabel>
                    <TextField {...params} id="harvest-log-picker" />
                  </div>
                )}
                disablePortal
              />
            </Box>
          );
        }}
      />

      <Box display="flex" flexDirection="column" gap={1}>
        <InputLabel htmlFor="harvest-log-product">Product - Unit</InputLabel>
        <OutlinedInput
          id="harvest-log-product"
          value={selectedProduct}
          disabled
        />
      </Box>

      <Controller
        control={control}
        name="collectedAmount"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="harvest-log-amount">Amount*</InputLabel>
              <OutlinedInput {...field} id="harvest-log-amount" />
            </Box>
          );
        }}
      />
      <Controller
        control={control}
        name="seasonDeductionsIds"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel id="harvest-log-deductions">Deduction</InputLabel>
              <Select
                {...field}
                labelId="harvest-log-deductions"
                id="demo-multiple-checkbox"
                value={deductionName}
                onChange={handleChange}
                input={<OutlinedInput label="Deduction" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                multiple
              >
                {deductions.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={deductionName.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          );
        }}
      />
      <Controller
        control={control}
        name="notes"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="harvest-log-notes">Note</InputLabel>

              <OutlinedInput
                {...field}
                id="harvest-log-notes"
                multiline
                rows={3}
              />
            </Box>
          );
        }}
      />
      <Box display="flex" justifyContent="space-between">
        <Button onClick={onCreateHarvestLogClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </Box>
    </Box>
  );

  return (
    <Drawer anchor="right" {...props}>
      {<>{harvestLogForm}</>}
    </Drawer>
  );
};

export default HarvestLogDrawer;
