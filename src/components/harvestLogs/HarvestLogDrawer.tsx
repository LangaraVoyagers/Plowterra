import * as React from "react";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerProps,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
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
  ISeasonResponse,
} from "project-2-types/dist/interface";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { getPickers } from "api/pickers";
import { getSeasons } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";
import { BodyText, Display } from "ui/Typography";
import ConfirmationDrawer from "ui/ConfirmationDrawer";
import HarvestLogSuccess from "../../assets/images/HarvestLogSuccess.svg";
import { FormattedMessage, useIntl } from "react-intl";
import { useUser } from "context/UserProvider";

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
  const { user } = useUser();
  const { showAlert } = useAlert();
  const intl = useIntl();

  const {
    CREATE_MUTATION_KEY,
    GET_DETAIL_QUERY_KEY,
    UPDATE_MUTATION_KEY,

    createCache: createHarvestLogCache,
    updateCache: updateHarvestLogCache,
  } = useQueryCache("harvestLogs", harvestLogId);

  const { GET_QUERY_KEY: PICKERS_QUERY_KEY } = useQueryCache("pickers");

  const { GET_QUERY_KEY: SEASONS_QUERY_KEY } = useQueryCache("seasons");

  const [harvestLog, setHarvestLog] = useState<IHarvestLogResponse>();
  const [seasons, setSeasons] = useState<Array<ISeasonResponse>>([]);

  const [showEditForm, setShowEditForm] = useState<boolean>(!harvestLogId);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [pickers, setPickers] = React.useState<Array<IPickerResponse>>([]);
  const [season, setSeason] = useState<ISeasonResponse>();
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
      farmId: user.farm._id,
      seasonDeductionIds: [],
    },
    resolver: ajvResolver(HarvestLogSchema),
  });

  const createHarvestLogDataList = React.useCallback(() => {
    return [
      [
        "Date",
        intl.formatDate(harvestLog?.createdAt, {
          month: "long",
          year: "numeric",
          day: "numeric",
        }),
      ],
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

  useQuery({
    queryKey: PICKERS_QUERY_KEY,
    queryFn: getPickers,
    onSuccess: (results) => {
      setPickers(results);
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "harvest.log.drawer.get.pickers.error",
          defaultMessage: "No pickers found",
        }),
        "error"
      );
    },
  });

  useQuery({
    queryKey: SEASONS_QUERY_KEY,
    queryFn: () => getSeasons({ status: "ACTIVE" }),
    onSuccess: (results) => {
      setSeasons(results);
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "harvest.log.drawer.get.seasons.error",
          defaultMessage: "No seasons found",
        }),
        "error"
      );
    },
  });

  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: GET_DETAIL_QUERY_KEY,
    queryFn: () => getHarvestLogById(harvestLogId),
    enabled: !!harvestLogId,
    onSuccess: (result) => {
      setHarvestLog(result);
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "harvest.log.drawer.get.harvest.log.detail.error",
          defaultMessage: "No harvest log found",
        }),
        "error"
      );
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
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "harvest.log.drawer.save.harvest.log.error",
          defaultMessage: "Oops! The harvest log couldn't be saved.",
        }),
        "error"
      );
    },
  });

  const onCreateHarvestLogClose = () => {
    setSeason(undefined);
    dismiss();
  };

  const handleCreateSuccess = (
    created: IHarvestLogResponse & { _id: string }
  ) => {
    createHarvestLogCache(created);
    setShowSuccess(true);
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
      seasonDeductionIds: data.seasonDeductionIds,
      notes: data.notes,
    });
  };

  const defaultSeason = JSON.parse(localStorage.getItem("season") || "{}");

  const harvestLogForm = (
    <Box
      display="flex"
      flexDirection="column"
      padding="3rem"
      gap={3}
      width={600}
    >
      <Display>
        <FormattedMessage
          id="harvest.logs.drawer.create.form.titme"
          defaultMessage="Add Harvest Log"
        />
      </Display>
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
                value={
                  value
                    ? { id: value, label: value }
                    : { id: defaultSeason.id, label: defaultSeason.name }
                }
                onChange={(_, newValue) => {
                  onChange(newValue?.id);
                  setSeason(
                    seasons?.find(
                      (s: { _id: string }) => s._id === newValue?.id
                    )
                  );
                }}
                getOptionLabel={(option) => option.label || ""}
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
          value={intl.formatDate(new Date(), { dateStyle: "short" })}
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
                value={
                  value
                    ? {
                        id: value,
                        label: pickers.find((picker) => picker._id === value)
                          ?.name as string,
                      }
                    : undefined
                }
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
        render={({ field: { value, onChange } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel id="harvest-log-deductions">Deduction</InputLabel>
              <Select
                labelId="harvest-log-deductions"
                value={value.map((id) => [id])}
                label="Deduction"
                variant="outlined"
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                multiple
              >
                {season?.deductions.map((deduction, index) => {
                  const checked = !!value.find(
                    (selected) => selected === deduction.deductionID
                  );
                  return (
                    <MenuItem
                      key={index}
                      value={[deduction.deductionID]}
                      onClick={() => {
                        if (checked) {
                          onChange(
                            value.filter((de) => de !== deduction.deductionID)
                          );
                        } else {
                          onChange([...value, deduction.deductionID]);
                        }
                      }}
                    >
                      <Checkbox checked={checked} />
                      <ListItemText primary={deduction.deductionID} />
                    </MenuItem>
                  );
                })}
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

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          Save
        </Button>

        {/* <Dialog open={open} onClose={handleClose}>
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
            <Display
              color="grey-800"
              size="sm"
              fontWeight="SemiBold"
              style={{
                textAlign: "center",
                paddingTop: "20px",
              }}
            >
              New Season Created!
            </Display>
            <BodyText
              size="md"
              style={{
                color: "grey-800",
                textAlign: "center",
                paddingBottom: "32px",
                paddingTop: "32px",
              }}
            >
              {selectedPicker?.label} will receive an SMS with the summary.
            </BodyText>
            <DialogActions
              style={{ justifyContent: "space-between", width: "100%" }}
            >
              <Button
                onClick={handleClose}
                color="primary"
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
        </Dialog> */}
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
        <Button variant="text" onClick={onCreateHarvestLogClose}>
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
    <>
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
      {!!showSuccess && (
        <ConfirmationDrawer
          open
          imageStyle={{
            width: "6.75rem",
            height: "6.47rem",
          }}
          image={HarvestLogSuccess}
          title={intl.formatMessage({
            id: "harvest.logs.new.entry.success.drawer.title",
            defaultMessage: "Harvest Entry Completed!",
          })}
          message={intl.formatMessage(
            {
              id: "harvest.logs.new.entry.success.drawer.message",
              defaultMessage: `{pickerName} will receive an SMS with the summary.`,
            },
            {
              pickerName: selectedPicker?.label,
            }
          )}
          backButtonTitle={intl.formatMessage({
            id: "harvest.logs.new.entry.success.drawer.back.button",
            defaultMessage: "Back to Harvest Log",
          })}
          onClose={() => {
            console.log("reset");
            reset();
            setShowSuccess(false);
            onCreateHarvestLogClose();
          }}
        />
      )}
    </>
  );
};

export default HarvestLogDrawer;
