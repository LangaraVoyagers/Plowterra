import * as React from "react";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  DrawerProps,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createHarvestLog, getHarvestLogById } from "api/harvestLogs";
import { useMutation, useQuery } from "react-query";
import HarvestLogSchema from "project-2-types/dist/ajv/harvest-log.ajv";
import {
  IPickerResponse,
  IHarvestLogResponse,
} from "project-2-types/dist/interface"
import { ajvResolver } from "@hookform/resolvers/ajv";
import { getPickers } from "api/pickers";
import { getSeasons } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";
import { BodyText, Display } from "ui/Typography";
import { TelegramLogo } from "@phosphor-icons/react";

function formatDate(date: number): string {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
}

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

interface ISeason {
  _id: string;
  name: string;
  product: { name: string };
}

interface IHarvestLogForm {
  farmId: string;
  seasonId: string;
  pickerId: string;
  collectedAmount: number;
  seasonDeductionIds: Array<string>;
  notes?: string;
}

const HarvestLogDrawer = ({
  dismiss,
  harvestLogId,
  ...props
}: HarvestLogDrawerProps) => {
  const { showAlert } = useAlert();
  const { CREATE_MUTATION_KEY, GET_DETAIL_QUERY_KEY, UPDATE_MUTATION_KEY } =
    useQueryCache("harvestLosgs", harvestLogId);

  const [harvestLog, setHarvestLog] = useState<IHarvestLogResponse>();
  const [seasons, setSeasons] = useState<Array<ISeason>>([]);

  const [showEditForm, setShowEditForm] = useState<boolean>(!harvestLogId);
  // Update this to ISeasonResponse
  const [season, setSeason] = useState<ISeason>();
  const [selectedPicker, setSelectedPicker] = React.useState<{
    id: string;
    label: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IHarvestLogForm>({
    defaultValues: {
      farmId: "65d703cf9a00b1a671609458", //TODO: get actual farmId
    },
    resolver: ajvResolver(HarvestLogSchema),
  });

  const createHarvestLogDataList = React.useCallback(() => {
    return [
      ["Date", formatDate(harvestLog?.createdAt || 0)],
      ["Harvest Season", harvestLog?.season?.name || ""],
      ["Product", harvestLog?.season?.product?.name || ""],
      ["Price Per Unit", harvestLog?.season?.price || ""],
      ["Amount", harvestLog?.collectedAmount || ""],
      ["Deduction", harvestLog?.totalDeduction || ""],
      ["Note", harvestLog?.notes || ""],
      [
        "Subtotal",
        (harvestLog?.season?.price || 0) * (harvestLog?.collectedAmount || 0) ||
          "",
      ], //price per unit * amount
      [
        "Total",
        (harvestLog?.season?.price || 0) * (harvestLog?.collectedAmount || 0) -
          (harvestLog?.totalDeduction || 0),
      ], //subtotal - deduction
    ];
  }, [harvestLog]);

  const [deductionName, setDeductionName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof deductionName>) => {
    const {
      target: { value },
    } = event;
    setDeductionName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const { GET_QUERY_KEY: PICKERS_QUERY_KEY } = useQueryCache("pickers");

  const [pickers, setPickers] = React.useState<Array<IPickerResponse>>([])

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
    updateCache: updateHarvestLogCache,
  } = useQueryCache("harvestLogs");

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

  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: GET_DETAIL_QUERY_KEY,
    queryFn: () => getHarvestLogById(harvestLogId),
    enabled: !!harvestLogId,
    onSuccess: (result) => {
      setHarvestLog(result);
    },
    onError: () => {
      showAlert("Oops! Information couldn't be displayed.", "error");
    },
  });

  const { mutate: saveHarvestLogMutation, isLoading } = useMutation({
    mutationKey: harvestLogId ? UPDATE_MUTATION_KEY : CREATE_MUTATION_KEY,
    mutationFn: createHarvestLog,
    onSuccess: (result) => {
      if (harvestLogId) {
        handleUpdateSuccess(result);
      } else {
        handleCreateSuccess(result);
      }
    },
    onError: () => {
      showAlert("Oops! The harvest log couldn't be saved.", "error");
    },
  });

  const onCreateHarvestLogClose = () => {
    reset();
    setSeason(undefined);
    dismiss();
  };

  const handleCreateSuccess = (
    created: IHarvestLogResponse & { _id: string }
  ) => {
    createHarvestLogCache(created);
    showAlert(`Harvest Log created successfully`, "success");
    onCreateHarvestLogClose();
  };

  const handleUpdateSuccess = (
    updated: IHarvestLogResponse & { _id: string }
  ) => {
    updateHarvestLogCache(updated);
    showAlert(`Harvest Log updated successfully`, "success");
    hideEdit();
  };

  const hideEdit = () => setShowEditForm(false);

  const onSubmit = (data: IHarvestLogForm) => {
    saveHarvestLogMutation({
      farmId: data.farmId,
      collectedAmount: data.collectedAmount,
      pickerId: data.pickerId,
      seasonId: data.seasonId,
      seasonDeductionIds: [], //TODO: get actual data
      notes: data.notes,
    });
    handleClose();
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const harvestLogForm = (
    <Box
      display="flex"
      flexDirection="column"
      padding="3rem"
      gap={3}
      width={600}
    >
      <Display>Add Harvest Log</Display>
      <Controller
        control={control}
        name="seasonId"
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
                value={value ? { id: value, label: value } : undefined}
                onChange={(_, newValue) => {
                  onChange(newValue?.id);
                  setSeason(
                    seasons?.find(
                      (s: { _id: string }) => s._id === newValue?.id
                    )
                  );
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <div>
                    <InputLabel htmlFor="harvest-log-season">
                      Harvest Season Name*
                    </InputLabel>
                    <TextField
                      {...params}
                      id="harvest-log-season"
                      helperText={errors.seasonId?.message}
                      error={!!errors.seasonId}
                    />
                  </div>
                )}
              />
            </Box>
          );
        }}
      />

      <Box display="flex" flexDirection="column" gap={1}>
        <InputLabel htmlFor="harvest-log-date">Date</InputLabel>
        <OutlinedInput
          id="harvest-log-date"
          value={formatDate(new Date().getTime())}
          disabled
        />
      </Box>

      <Controller
        control={control}
        name="pickerId"
        render={({ field: { onChange, value } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <Autocomplete
                id="picker-combo-box"
                value={value ? { id: value, label: value } : undefined}
                onChange={(_, newValue) => {
                  setSelectedPicker(newValue);
                  onChange(newValue?.id);
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
                    <TextField
                      {...params}
                      id="harvest-log-picker"
                      helperText={errors.pickerId?.message}
                      error={!!errors.pickerId}
                    />
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
          value={season?.product?.name ?? "-"}
          disabled
        />
      </Box>

      <Controller
        control={control}
        name="collectedAmount"
        render={({ field: { ref, value, onChange } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="harvest-log-amount">Amount*</InputLabel>

              <TextField
                id="harvest-log-amount"
                ref={ref}
                value={value}
                onChange={(event) => {
                  if (event.target.value) {
                    onChange(Number(event.target.value));
                  } else {
                    onChange(undefined);
                  }
                }}
                margin="dense"
                type="number"
                error={!!errors.collectedAmount}
                helperText={errors.collectedAmount?.message}
                variant="outlined"
              />
            </Box>
          );
        }}
      />
      <Controller
        control={control}
        name="seasonDeductionIds"
        render={() => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel id="harvest-log-deductions">Deduction</InputLabel>
              <Select
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
              {errors.seasonDeductionIds && (
                <p>{errors.seasonDeductionIds.message}</p>
              )}
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

              <TextField
                {...field}
                id="harvest-log-notes"
                multiline
                rows={3}
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            </Box>
          );
        }}
      />
      <Box display="flex" justifyContent="space-between">
        <Button
          disabled={isLoading}
          onClick={harvestLogId ? hideEdit : onCreateHarvestLogClose}
        >
          Cancel
        </Button>

        <Button variant="contained" onClick={handleOpen} disabled={isLoading}>
          Save
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px 28px 24px",
              borderRadius: "16px",
            }}
          >
            <TelegramLogo size={40} style={{ color: "#055E40" }} />
            <DialogTitle
              style={{
                fontSize: "30px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "38px",
                letterSpacing: "-0.3px",
                paddingTop: "20px",
              }}
            >
              Harvest Entry Completed!
            </DialogTitle>
            <DialogContent
              style={{
                paddingBottom: "32px",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              {selectedPicker?.label} will receive an SMS with the summary.
            </DialogContent>
            <DialogActions
              style={{ justifyContent: "space-between", width: "100%" }}
            >
              <Button
                onClick={handleClose}
                style={{
                  border: "1px solid var(--Colors-Brand-500, #055E40)",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                color="primary"
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </Box>
    </Box>
  );

  const harvestLogDetail = (
    <Box
      display="flex"
      flexDirection="column"
      padding="3rem"
      gap={3}
      width={600}
      height="100%"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        flex={1}
        justifyContent="flex-start"
      >
        <Box display="flex" flexDirection="column">
          <BodyText>PICKER</BodyText>
          <Display>{harvestLog?.picker?.name}</Display>
        </Box>

        <Box display="flex" flexDirection="column">
          <TableContainer>
            <Table aria-label="Harvest log detail table">
              <TableHead>
                <TableRow>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>INFO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {createHarvestLogDataList().map((row) => (
                  <TableRow key={row[0]}>
                    <TableCell component="th" scope="row">
                      {row[0]}
                    </TableCell>
                    <TableCell>{row[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* TODO: add correction note tables */}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" onClick={onCreateHarvestLogClose}>
          Back
        </Button>
        {/* TODO: link correction note button to correct feature */}
        <Button variant="contained" onClick={onCreateHarvestLogClose}>
          Add Correction Note
        </Button>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      {...props}
      onClose={!showEditForm ? dismiss : undefined}
    >
      {/* TODO: Display correct page */}
      {!isLoadingDetail && (
        <>{showEditForm ? harvestLogForm : harvestLogDetail}</>
      )}
    </Drawer>
  );
};

export default HarvestLogDrawer;
