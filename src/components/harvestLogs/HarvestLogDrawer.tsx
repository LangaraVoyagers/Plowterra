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
import { IHarvestLog } from "project-2-types/lib/harvestLog";
import { getPickers } from "api/pickers";
import { IPicker } from "project-2-types/lib/pickers";

interface IHarvestLogForm extends Omit<IHarvestLog, "_id"> {}

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const seasons = ["Season 1", "Season 2"]; //TODO: get actual data
const product = "Beans - kg"; //TODO: get actual data
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
  const { CREATE_MUTATION_KEY, createCache } = useQueryCache(
    "harvestLosgs",
    harvestLogId
  );

  const { control, handleSubmit, reset } = useForm<IHarvestLogForm>();

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

  const { GET_QUERY_KEY } = useQueryCache("pickers");

  const [pickers, setPickers] = React.useState<Array<IPicker>>([]);

  useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: getPickers,
    onSuccess: (results) => {
      setPickers(results);
    },
    onError: (error) => {
      console.log(error);
    },
  });

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

  const handleCreateSuccess = (created: IHarvestLog) => {
    const updatedCreated = { ...created, _id: "" };
    createCache(updatedCreated);
    showAlert(`Harvest Log created successfully`);
    onCreateHarvestLogClose();
  };

  const onSubmit = (data: IHarvestLogForm) => {
    saveHarvestLogMutation({
      ...data,
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
        render={() => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <Autocomplete
                disablePortal
                id="harvest-season-combo-box"
                options={seasons}
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

      {/* TODO: Show current date disabled */}
      <Box display="flex" flexDirection="column" gap={1}>
        <InputLabel htmlFor="harvest-log-date">Date*</InputLabel>
        <OutlinedInput id="harvest-log-date" value={formattedDate} disabled />
      </Box>

      <Controller
        control={control}
        name="picker"
        render={() => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <Autocomplete
                disablePortal
                id="picker-combo-box"
                options={pickers.map((picker) => ({
                  id: picker._id,
                  label: picker.name,
                }))}
                renderInput={(params) => (
                  <div>
                    <InputLabel htmlFor="harvest-log-picker">
                      Picker*
                    </InputLabel>
                    <TextField {...params} id="harvest-log-picker" />
                  </div>
                )}
              />
            </Box>
          );
        }}
      />

      {/* TODO: Show product */}
      <Box display="flex" flexDirection="column" gap={1}>
        <InputLabel htmlFor="harvest-log-product">Product - Unit</InputLabel>
        <OutlinedInput id="harvest-log-product" value={product} disabled />
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
        name="seasonDeductions"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel id="harvest-log-deductions">Deduction</InputLabel>
              <Select
                {...field}
                labelId="harvest-log-deductions"
                id="demo-multiple-checkbox"
                multiple
                value={deductionName}
                onChange={handleChange}
                input={<OutlinedInput label="Deduction" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
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
