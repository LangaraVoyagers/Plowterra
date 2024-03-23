import * as React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { CaretDown } from "@phosphor-icons/react";

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

interface IHarvestCorrectionForm {
  farmId: string;
  seasonId: string;
  pickerId: string;
  collectedAmount: number;
  seasonDeductionIds: Array<string>;
  notes?: string;
  parentId: string;
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

  const [openCorrectionEntry, setOpenCorrectionEntry] = React.useState(false);

  const {
    control: controlHarvestLog,
    handleSubmit: handleSubmitHarvestLog,
    reset: resetHarvestLog,
    formState: { errors: errorsHarvestLog },
  } = useForm<IHarvestLogForm>({
    defaultValues: {
      farmId: user.farm._id,
      seasonDeductionIds: [],
    },
    resolver: ajvResolver(HarvestLogSchema),
  });

  const {
    control: controlHarvestCorrection,
    handleSubmit: handleSubmitHarvestCorrection,
    formState: { errors: errorsHarvestCorrection },
  } = useForm<IHarvestCorrectionForm>({
    defaultValues: {
      farmId: user.farm._id,
      seasonDeductionIds: [],
      pickerId: harvestLog?.picker?._id as string,
      seasonId: harvestLog?.season?._id as string,
      parentId: harvestLogId as string,
    },
    // resolver: ajvResolver(HarvestLogSchema), //TODO: create a new schema for correction
  });

  const createHarvestLogDataList = React.useCallback(() => {
    const DATE = intl.formatMessage({
      id: "harvest-log.view.detail.date.label",
      defaultMessage: "Date",
    });

    const HARVEST_SEASON = intl.formatMessage({
      id: "harvest-log.view.detail.harvest-season.label",
      defaultMessage: "Harvest Season",
    });

    const PRODUCT = intl.formatMessage({
      id: "harvest-log.view.detail.product.label",
      defaultMessage: "Product",
    });

    const PRICE_PER_UNIT = intl.formatMessage({
      id: "harvest-log.view.detail.ppu.label",
      defaultMessage: "Price per Unit",
    });

    const AMOUNT = intl.formatMessage({
      id: "harvest-log.view.detail.amount.label",
      defaultMessage: "Amount",
    });

    const DEDUCTION = intl.formatMessage({
      id: "harvest-log.view.detail.deduction.label",
      defaultMessage: "Deduction",
    });

    const NOTE = intl.formatMessage({
      id: "harvest-log.view.detail.note.label",
      defaultMessage: "Note",
    });

    const SUBTOTAL = intl.formatMessage({
      id: "harvest-log.view.detail.subtotal.label",
      defaultMessage: "Subtotal",
    });

    const TOTAL = intl.formatMessage({
      id: "harvest-log.view.detail.total.label",
      defaultMessage: "Total",
    });

    return [
      [
        DATE,
        intl.formatDate(harvestLog?.createdAt, {
          month: "long",
          year: "numeric",
          day: "numeric",
        }),
      ],
      [HARVEST_SEASON, harvestLog?.season?.name || ""],
      [PRODUCT, harvestLog?.season?.product?.name || ""],
      [PRICE_PER_UNIT, harvestLog?.season?.price || ""],
      [AMOUNT, harvestLog?.collectedAmount || ""],
      [DEDUCTION, harvestLog?.totalDeduction || ""],
      [NOTE, harvestLog?.notes || ""],
      [
        SUBTOTAL,
        (harvestLog?.season?.price || 0) * (harvestLog?.collectedAmount || 0) ||
          "",
      ], //price per unit * amount
      [
        TOTAL,
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
    mutationKey:
      harvestLogId && !openCorrectionEntry
        ? UPDATE_MUTATION_KEY
        : CREATE_MUTATION_KEY,
    mutationFn: createHarvestLog,
    onSuccess: (result) => {
      if (harvestLogId && !openCorrectionEntry) {
        handleUpdateSuccess(result);
        console.log("update:", result);
      } else {
        handleCreateSuccess(result);
        console.log("create:", result);

        if (openCorrectionEntry) {
          setOpenCorrectionEntry(false);
        }
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

  const onAddCorrectionEntry = () => {
    setOpenCorrectionEntry(true);
  };

  const onCreateHarvestLogClose = () => {
    if (openCorrectionEntry) {
      setOpenCorrectionEntry(false);
    } else {
      setSeason(undefined);
      dismiss();
    }
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

  const onCorrection = (data: IHarvestCorrectionForm) => {
    saveHarvestLogMutation({
      farmId: data.farmId,
      collectedAmount: data.collectedAmount,
      pickerId: harvestLog?.picker?._id as string,
      seasonId: harvestLog?.season?._id as string,
      seasonDeductionIds: data.seasonDeductionIds,
      notes: "", // should actually be able to add a note too
      parentId: harvestLogId as string,
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
      <Display>
        <FormattedMessage
          id="harvest.logs.drawer.create.form.title"
          defaultMessage={intl.formatMessage({
            id: "harvest-log.create.form.label",
            defaultMessage: "Add Harvest Entry",
          })}
        />
      </Display>
      <Controller
        control={controlHarvestLog}
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
                      {intl.formatMessage({
                        id: "harvest-log.create.form.season.label",
                        defaultMessage: "Harvest Season",
                      })}
                      *
                    </InputLabel>
                    <TextField
                      {...params}
                      id="harvest-log-season"
                      helperText={errorsHarvestLog.seasonId?.message}
                      error={!!errorsHarvestLog.seasonId}
                    />
                  </div>
                )}
              />
            </Box>
          );
        }}
      />

      <Box display="flex" flexDirection="column" gap={1}>
        <InputLabel htmlFor="harvest-log-date">
          {intl.formatMessage({
            id: "harvest-log.create.form.date.label",
            defaultMessage: "Date",
          })}
        </InputLabel>
        <OutlinedInput
          id="harvest-log-date"
          value={intl.formatDate(new Date(), {
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
          disabled
        />
      </Box>

      <Controller
        control={controlHarvestLog}
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
                      {intl.formatMessage({
                        id: "harvest-log.create.form.picker.label",
                        defaultMessage: "Picker",
                      })}
                      *
                    </InputLabel>
                    <TextField
                      {...params}
                      id="harvest-log-picker"
                      helperText={errorsHarvestLog.pickerId?.message}
                      error={!!errorsHarvestLog.pickerId}
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
        <InputLabel htmlFor="harvest-log-product">
          {intl.formatMessage({
            id: "harvest-log.create.form.product.label",
            defaultMessage: "Product - Unit",
          })}
        </InputLabel>
        <OutlinedInput
          id="harvest-log-product"
          value={season?.product?.name ?? "-"}
          disabled
        />
      </Box>

      <Controller
        control={controlHarvestLog}
        name="collectedAmount"
        render={({ field: { ref, value, onChange } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="harvest-log-amount">
                {intl.formatMessage({
                  id: "harvest-log.create.form.amount.label",
                  defaultMessage: "Amount",
                })}
                *
              </InputLabel>

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
                error={!!errorsHarvestLog.collectedAmount}
                helperText={errorsHarvestLog.collectedAmount?.message}
                variant="outlined"
              />
            </Box>
          );
        }}
      />

      <Controller
        control={controlHarvestLog}
        name="seasonDeductionIds"
        render={({ field: { value, onChange } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel id="harvest-log-deductions">
                {intl.formatMessage({
                  id: "harvest-log.create.form.deduction.label",
                  defaultMessage: "Deduction",
                })}
              </InputLabel>
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
              {errorsHarvestLog.seasonDeductionIds && (
                <p>{errorsHarvestLog.seasonDeductionIds.message}</p>
              )}
            </Box>
          );
        }}
      />

      <Controller
        control={controlHarvestLog}
        name="notes"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="harvest-log-notes">
                {intl.formatMessage({
                  id: "harvest-log.create.form.note.label",
                  defaultMessage: "Note",
                })}
              </InputLabel>

              <TextField
                {...field}
                id="harvest-log-notes"
                multiline
                rows={3}
                error={!!errorsHarvestLog.notes}
                helperText={errorsHarvestLog.notes?.message}
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
          onClick={handleSubmitHarvestLog(onSubmit)}
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
          <BodyText>
            {intl.formatMessage({
              id: "harvest-log.view.detail.picker.label",
              defaultMessage: "PICKER",
            })}
          </BodyText>
          <Display>{harvestLog?.picker?.name}</Display>
        </Box>

        <Box display="flex" flexDirection="column">
          <TableContainer>
            <Table aria-label="Harvest log detail table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {intl.formatMessage({
                      id: "harvest-log.view.detail.category.label",
                      defaultMessage: "CATEGORY",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "harvest-log.view.detail.info.label",
                      defaultMessage: "INFO",
                    })}
                  </TableCell>
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
        </Box>

        {!!harvestLog?.correctionLogs?.length && (
          <Box>
            <BodyText>
              {intl.formatMessage({
                id: "harvest-log.view.detail.correction-entries.label",
                defaultMessage: "Correction Entries",
              })}
            </BodyText>
            {harvestLog.correctionLogs.map((correctionEntry: any) => (
              <Accordion key={correctionEntry.id}>
                <AccordionSummary
                  expandIcon={<CaretDown />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {intl.formatDate(correctionEntry?.createdAt, {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  })}
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table aria-label="Correction entry details">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {intl.formatMessage({
                              id: "harvest-log.view.detail.correction-amount.label",
                              defaultMessage: "Amount",
                            })}
                          </TableCell>
                          <TableCell>
                            {correctionEntry.collectedAmount}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {intl.formatMessage({
                              id: "harvest-log.view.detail.correction-deduction.label",
                              defaultMessage: "Deduction",
                            })}
                          </TableCell>
                          <TableCell>
                            {correctionEntry.totalDeduction}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {!!openCorrectionEntry && (
          <Box display="flex" flexDirection="column">
            <BodyText>
              {intl.formatMessage({
                id: "harvest-log.add-correction-entry.label",
                defaultMessage: "Add Correction Entry",
              })}
            </BodyText>
            <Controller
              control={controlHarvestCorrection}
              name="collectedAmount"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <InputLabel htmlFor="harvest-log-amount">
                      {intl.formatMessage({
                        id: "harvest-log.create.form.amount.label",
                        defaultMessage: "Amount",
                      })}
                      *
                    </InputLabel>

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
                      error={!!errorsHarvestCorrection.collectedAmount}
                      helperText={
                        errorsHarvestCorrection.collectedAmount?.message
                      }
                      variant="outlined"
                    />
                  </Box>
                );
              }}
            />

            <Controller
              control={controlHarvestCorrection}
              name="seasonDeductionIds"
              render={({ field: { value, onChange } }) => {
                return (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <InputLabel id="harvest-log-deductions">
                      {intl.formatMessage({
                        id: "harvest-log.create.form.deduction.label",
                        defaultMessage: "Deduction",
                      })}
                    </InputLabel>
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
                                  value.filter(
                                    (de) => de !== deduction.deductionID
                                  )
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
                    {errorsHarvestCorrection.seasonDeductionIds && (
                      <p>
                        {errorsHarvestCorrection.seasonDeductionIds.message}
                      </p>
                    )}
                  </Box>
                );
              }}
            />
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button variant="text" onClick={onCreateHarvestLogClose}>
          {openCorrectionEntry
            ? intl.formatMessage({
                id: "harvest-log.view.detail.cancel.button.label",
                defaultMessage: "Cancel",
              })
            : intl.formatMessage({
                id: "harvest-log.view.detail.back.button.label",
                defaultMessage: "Back",
              })}
        </Button>

        {openCorrectionEntry ? (
          <Button
            variant="contained"
            onClick={handleSubmitHarvestCorrection(onCorrection)}
          >
            {intl.formatMessage({
              id: "harvest-log.view.detail.save-correction-entry.button.label",
              defaultMessage: "Save Correction Entry",
            })}
          </Button>
        ) : (
          <Button variant="contained" onClick={onAddCorrectionEntry}>
            {intl.formatMessage({
              id: "harvest-log.view.detail.add-correction-entry.button.label",
              defaultMessage: "Add Correction Entry",
            })}
          </Button>
        )}
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
            resetHarvestLog();
            setShowSuccess(false);
            onCreateHarvestLogClose();
          }}
        />
      )}
    </>
  );
};

export default HarvestLogDrawer;
