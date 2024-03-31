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
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BodyText, Display } from "ui/Typography";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import {
  IHarvestLogResponse,
  IPickerResponse,
  ISeasonResponse,
} from "project-2-types/dist/interface";
import { createHarvestLog, getHarvestLogById } from "api/harvestLogs";
import { useMutation, useQuery } from "react-query";

import { CaretDown } from "@phosphor-icons/react";
import ConfirmationDrawer from "ui/ConfirmationDrawer";
import Detail from "ui/Detail";
import DrawerContainer from "ui/DrawerContainer";
import HarvestLogSchema from "project-2-types/dist/ajv/harvest-log.ajv";
import HarvestLogSuccess from "../../assets/images/HarvestLogSuccess.svg";
import InputLabel from "ui/InputLabel";
import Tag from "ui/Tag";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { getPickers } from "api/pickers";
import { getSeasons } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";
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
  const { user, defaultSeason } = useUser();
  const { showAlert } = useAlert();
  const intl = useIntl();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

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
      seasonId: defaultSeason,
      seasonDeductionIds: [],
    },
    resolver: ajvResolver(HarvestLogSchema),
  });

  const {
    control: controlHarvestCorrection,
    handleSubmit: handleSubmitHarvestCorrection,
    reset: resetHarvestLogCorrection,
    formState: { errors: errorsHarvestCorrection },
  } = useForm<IHarvestCorrectionForm>({
    defaultValues: {
      farmId: user.farm._id,
      seasonDeductionIds: [],
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

    const PRICE_PER_UNIT = (
      <Box display="flex" gap={1} alignItems="center">
        {intl.formatMessage({
          id: "harvest-log.view.detail.ppu.label",
          defaultMessage: "Price per Unit",
        })}
        <Tag>{harvestLog?.season?.currency.name}</Tag>
      </Box>
    );

    const AMOUNT = intl.formatMessage({
      id: "harvest-log.view.detail.amount.label",
      defaultMessage: "Amount",
    });

    const NOTE = intl.formatMessage({
      id: "harvest-log.view.detail.note.label",
      defaultMessage: "Notes",
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
      [
        AMOUNT,
        `${harvestLog?.collectedAmount} ${harvestLog?.season?.unit.name}` || "",
      ],
      [NOTE, harvestLog?.notes || "-"],
    ];
  }, [harvestLog]);

  const createSubTotals = React.useCallback(() => {
    const SUBTOTAL = (
      <Box display="flex" gap={1} alignItems="center">
        {intl.formatMessage({
          id: "harvest-log.view.detail.subtotal.label",
          defaultMessage: "Subtotal",
        })}
        <Tag>{harvestLog?.season?.currency.name}</Tag>
      </Box>
    );

    const DEDUCTIONS_TOTAL = (
      <Box display="flex" gap={1} alignItems="center">
        {intl.formatMessage({
          id: "harvest-log.view.detail.deduction.total.label",
          defaultMessage: "Deduction Total",
        })}
        <Tag>{harvestLog?.season?.currency.name}</Tag>
      </Box>
    );

    return [
      [
        SUBTOTAL,
        (harvestLog?.season?.price || 0) * (harvestLog?.collectedAmount || 0) ||
          "",
      ], //price per unit * amount
      [DEDUCTIONS_TOTAL, harvestLog?.totalDeduction || 0],
    ];
  }, [harvestLog]);

  const createTotal = React.useCallback(() => {
    const TOTAL = (
      <Box display="flex" gap={1} alignItems="center">
        {intl.formatMessage({
          id: "harvest-log.view.detail.total.label",
          defaultMessage: "Total",
        })}
        <Tag>{harvestLog?.season?.currency.name}</Tag>
      </Box>
    );
    return [
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
      } else {
        handleCreateSuccess(result);
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
      resetHarvestLogCorrection();
    } else {
      resetHarvestLog();
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
      parentId: harvestLog?.id as string,
    });
  };

  const harvestLogForm = (
    <DrawerContainer
      footer={
        <Box display="flex" justifyContent="space-between">
          <Button
            disabled={isLoading}
            onClick={harvestLogId ? hideEdit : onCreateHarvestLogClose}
            variant="outlined"
          >
            {intl.formatMessage({
              id: "button.cancel",
              defaultMessage: "Cancel",
            })}
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmitHarvestLog(onSubmit)}
            disabled={isLoading}
          >
            {intl.formatMessage({
              id: "button.save",
              defaultMessage: "Save",
            })}
          </Button>
        </Box>
      }
    >
      <Display component="h1" size="md" fontWeight="SemiBold">
        <FormattedMessage
          id="harvest.logs.drawer.create.form.title"
          defaultMessage={"Add Harvest Entry"}
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
                value={
                  value
                    ? {
                        id: value,
                        label:
                          seasons.find((season) => season._id === value)
                            ?.name ?? "",
                      }
                    : undefined
                }
                onChange={(_, newValue) => {
                  onChange(newValue?.id);
                  setSeason(
                    seasons?.find(
                      (s: { _id: string }) => s._id === newValue?.id
                    )
                  );
                }}
                size="small"
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <div>
                    <InputLabel htmlFor="harvest-log-season" required>
                      {intl.formatMessage({
                        id: "harvest-log.create.form.season.label",
                        defaultMessage: "Harvest Season",
                      })}
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
          size="small"
          value={intl.formatDate(new Date(), { dateStyle: "short" })}
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
                    <InputLabel htmlFor="harvest-log-picker" required>
                      {intl.formatMessage({
                        id: "harvest-log.create.form.picker.label",
                        defaultMessage: "Picker",
                      })}
                    </InputLabel>
                    <TextField
                      {...params}
                      id="harvest-log-picker"
                      helperText={errorsHarvestLog.pickerId?.message}
                      error={!!errorsHarvestLog.pickerId}
                      size="small"
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
          value={`${season?.product?.name ?? ""} - ${season?.unit?.name ?? ""}`}
          size="small"
          disabled
        />
      </Box>

      <Controller
        control={controlHarvestLog}
        name="collectedAmount"
        render={({ field: { ref, value, onChange } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="harvest-log-amount" required>
                {intl.formatMessage({
                  id: "harvest-log.create.form.amount.label",
                  defaultMessage: "Amount",
                })}
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
                size="small"
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
              <InputLabel htmlFor="harvest-log-deductions">
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
                size="small"
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
                  defaultMessage: "Notes",
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
    </DrawerContainer>
  );

  const harvestLogDetail = (
    <DrawerContainer
      footer={
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onCreateHarvestLogClose}>
            {openCorrectionEntry
              ? intl.formatMessage({
                  id: "button.cancel",
                  defaultMessage: "Cancel",
                })
              : intl.formatMessage({
                  id: "button.back",
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
      }
      paddingX="0"
    >
      <Detail
        category={intl.formatMessage({
          id: "harvest-log.view.detail.picker.label",
          defaultMessage: "PICKER",
        })}
        title={harvestLog?.picker?.name}
        data={createHarvestLogDataList()}
        subfooter={createSubTotals()}
        footer={createTotal()}
      />

      {!!harvestLog?.correctionLogs?.length && (
        <Box
          display="flex"
          flexDirection="column"
          gap="1.25rem"
          paddingX="1.5rem"
        >
          <BodyText size="md" component="h2" fontWeight="SemiBold">
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
                        <TableCell>{correctionEntry.collectedAmount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {intl.formatMessage({
                            id: "harvest-log.view.detail.correction-deduction.label",
                            defaultMessage: "Deduction",
                          })}
                        </TableCell>
                        <TableCell>{correctionEntry.totalDeduction}</TableCell>
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
        <Box
          display="flex"
          flexDirection="column"
          gap="1.25rem"
          paddingX="1.5rem"
        >
          <BodyText size="md" component="h2" fontWeight="SemiBold">
            {intl.formatMessage({
              id: "harvest-log.add-correction-entry.label",
              defaultMessage: "Add correction entry",
            })}
          </BodyText>
          <Controller
            control={controlHarvestCorrection}
            name="collectedAmount"
            render={({ field: { ref, value, onChange } }) => {
              return (
                <Box display="flex" flexDirection="column">
                  <InputLabel htmlFor="harvest-log-amount" required>
                    {intl.formatMessage({
                      id: "harvest-log.create.form.amount.label",
                      defaultMessage: "Amount",
                    })}
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
                    size="small"
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
                  <InputLabel htmlFor="harvest-log-deductions">
                    {intl.formatMessage({
                      id: "harvest-log.create.form.deduction.label",
                      defaultMessage: "Deduction",
                    })}
                  </InputLabel>
                  <Select
                    id="harvest-log-deductions"
                    value={value.map((id) => [id])}
                    label="Deduction"
                    variant="outlined"
                    size="small"
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
                    <p>{errorsHarvestCorrection.seasonDeductionIds.message}</p>
                  )}
                </Box>
              );
            }}
          />
        </Box>
      )}
    </DrawerContainer>
  );

  React.useEffect(() => {
    if (defaultSeason && props.open) {
      setSeason(seasons?.find((s: { _id: string }) => s._id === defaultSeason));
    }
  }, [defaultSeason, props.open]);

  return (
    <>
      <Drawer
        anchor="right"
        {...props}
        PaperProps={{
          sx: {
            width: desktop ? 500 : "100%",
          },
        }}
        onClose={
          !showEditForm
            ? () => {
                resetHarvestLog();
                dismiss();
              }
            : undefined
        }
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
              pickerName: selectedPicker?.label ?? harvestLog?.picker?.name,
            }
          )}
          backButtonTitle={intl.formatMessage({
            id: "harvest.logs.new.entry.success.drawer.back.button",
            defaultMessage: "Back to Harvest Log",
          })}
          onClose={() => {
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
