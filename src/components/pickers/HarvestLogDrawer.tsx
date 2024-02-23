import * as React from "react";
import {
  Box,
  Button,
  Drawer,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Typography,
  TextField,
  Autocomplete,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IHarvestLogForm {
  name: string;
  date: string;
  picker: string;
  product: string;
  amount: string;
  deductions: string;
  notes: string;
}

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

const deductions = ["Transport", "Meal", "Storage", "Other"];

const HarvestLogDrawer = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<IHarvestLogForm>();

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  const onSubmit = (data: IHarvestLogForm) => {
    console.log({ data });
  };

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

  return (
    <div>
      <Button variant="contained" onClick={showDrawer}>
        Add New Log
      </Button>
      <Drawer anchor="right" open={open}>
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
            name="name"
            render={() => {
              return (
                <Box display="flex" flexDirection="column" gap={1}>
                  <Autocomplete
                    disablePortal
                    id="harvest-season-combo-box"
                    options={[{ label: "Season 1" }, { label: "Season 2" }]} // TODO: Replace with actual data
                    renderInput={(params) => (
                      <div>
                        <InputLabel htmlFor="harvest-log-season">
                          Harvest Season Name**
                        </InputLabel>
                        <TextField {...params} id="harvest-log-season" />
                      </div>
                    )}
                  />
                </Box>
              );
            }}
          />

          <Controller
            control={control}
            name="date"
            render={({ field }) => {
              return (
                <Box display="flex" flexDirection="column" gap={1}>
                  <InputLabel htmlFor="harvest-log-date">Date*</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        {...field}
                        label=""
                        defaultValue={dayjs(new Date())}
                        id="harvest-log-date"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
              );
            }}
          />

          <Controller
            control={control}
            name="picker"
            render={() => {
              return (
                <Box display="flex" flexDirection="column" gap={1}>
                  <Autocomplete
                    disablePortal
                    id="picker-combo-box"
                    options={[{ label: "John Doe" }, { label: "Jane Doe" }]} // TODO: Replace with actual data
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

          <Controller
            control={control}
            name="product"
            render={({ field }) => {
              return (
                <Box display="flex" flexDirection="column" gap={1}>
                  <InputLabel htmlFor="harvest-log-product">
                    Product - Unit
                  </InputLabel>
                  <OutlinedInput {...field} id="harvest-log-product" disabled />
                </Box>
              );
            }}
          />

          <Controller
            control={control}
            name="amount"
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
            name="deductions"
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
            <Button onClick={hideDrawer}>Cancel</Button>

            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default HarvestLogDrawer;
