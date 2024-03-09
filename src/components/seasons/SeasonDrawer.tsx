import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Drawer,
  DrawerProps,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { deleteSeason, getSeasonById, upsertSeason } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import dayjs, { Dayjs } from "dayjs";
import useQueryCache from "hooks/useQueryCache";
import {
  ISeasonRequest,
  ISeasonResponse,
  PayrollTimeframeEnum,
} from "project-2-types/dist";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "react-query";
import { Display } from "ui/Typography";

const payrollTimeframeList = (
  Object.keys(PayrollTimeframeEnum) as Array<keyof typeof PayrollTimeframeEnum>
).map((key) => ({ value: key, label: PayrollTimeframeEnum[key] }));

type SeasonDrawerProps = DrawerProps & {
  seasonId?: string;
  dismiss: () => void;
};

interface IProductSchema {
  _id: string;
  name: string;
}

const SeasonDrawer = ({ dismiss, seasonId, ...props }: SeasonDrawerProps) => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const {
    GET_DETAIL_QUERY_KEY,
    UPDATE_MUTATION_KEY,
    CREATE_MUTATION_KEY,
    createCache,
    updateCache,
    deleteCache,
  } = useQueryCache("seasons", seasonId);

  const [showEditForm, setShowEditForm] = useState<boolean>(!seasonId);

  const {
    control,
    handleSubmit,
    reset,
    // getValues,
    formState: { isDirty, errors },
  } = useForm<ISeasonRequest>({
    mode: "all",
    defaultValues: {
      name: "",
    },
    // resolver: validateResolver(SeasonSchema), TODO: Validate schema
  });

  //   const seasonData = getValues();

  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: GET_DETAIL_QUERY_KEY,
    queryFn: () => getSeasonById(seasonId),
    enabled: !!seasonId,
    onSuccess: (result) => {
      reset(result);
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "season.detail.error",
          defaultMessage: "Oops! Information couldn't be displayed.",
        }),
        "error"
      );
    },
  });

  const { mutate: saveSeasonMutation, isLoading } = useMutation({
    mutationKey: seasonId ? UPDATE_MUTATION_KEY : CREATE_MUTATION_KEY,
    mutationFn: upsertSeason,
    onSuccess: (result) => {
      if (seasonId) {
        handleUpdateSuccess(result);
      } else {
        handleCreateSuccess(result);
      }
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "seasons.create.season.response.error",
          defaultMessage: "Oops! The season couldn't be saved.",
        }),
        "error"
      );
    },
  });

  const onCreateSeasonClose = () => {
    reset();
    dismiss();
  };

  const handleCreateSuccess = (created: ISeasonResponse & { _id: string }) => {
    createCache(created);
    showAlert(
      intl.formatMessage({
        id: "seasons.create.season.response.success",
        defaultMessage: "The season was created successfully",
      }),
      "success"
    );
    onCreateSeasonClose();
  };

  const handleUpdateSuccess = (updated: ISeasonResponse & { _id: string }) => {
    updateCache(updated);
    showAlert(
      intl.formatMessage({
        id: "seasons.update.season.response.success",
        defaultMessage: "The season was updated successfully",
      }),
      "success"
    );
    hideEdit();
  };

  const showEdit = () => setShowEditForm(true);
  const hideEdit = () => setShowEditForm(false);

  const { mutate: deleteSeasonMutation, isLoading: isDeleting } = useMutation({
    mutationKey: ["pickers", "delete", seasonId],
    mutationFn: deleteSeason,
    onSuccess: (result) => {
      deleteCache(result);
      showAlert(
        intl.formatMessage({
          id: "seasons.delete.season.response.success",
          defaultMessage: "The season was deleted successfully.",
        }),
        "success"
      );
      dismiss();
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "seasons.delete.season.response.error",
          defaultMessage: "Oops! The season couldn't be deleted.",
        }),
        "error"
      );
    },
  });

  const onSubmit = (data: ISeasonRequest) => {
    saveSeasonMutation({ ...data, seasonId: seasonId || "" });
  };

  const onDelete = () => {
    deleteSeasonMutation(seasonId);
  };

  const [season, setSeason] = useState<ISeasonResponse | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  // const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [products, setProducts] = useState<Array<IProductSchema>>([]);
  const [product, setProduct] = useState<IProductSchema | null>(null);
  const [units, setUnits] = useState<Array<IProductSchema>>([]);
  const [unit, setUnit] = useState<IProductSchema | null>(null);

  const seasonForm = (
    <Box
      display="flex"
      flexDirection="column"
      padding="3rem"
      gap={3}
      width={600}
    >
      <Display>
        {intl.formatMessage(
          {
            id: "seasons.detail.title",
            defaultMessage:
              "{isEdit, plural, one {Edit Season} other {Add New Season} }",
          },
          { isEdit: Number(!!seasonId) }
        )}
      </Display>
      <Controller
        control={control}
        name="name"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="season-name-input">
                {intl.formatMessage({
                  id: "seasons.create.form.name.label",
                  defaultMessage: "Harvest Season Name",
                })}
                *
              </InputLabel>
              <TextField
                {...field}
                id="season-name-input"
                variant="outlined"
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="startDate"
        render={() => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="season-start-date-input">
                {intl.formatMessage({
                  id: "seasons.create.form.start_date.label",
                  defaultMessage: "Start Date",
                })}
                *
              </InputLabel>
              <DatePicker
                // label="Start Date"
                value={startDate}
                slotProps={{ textField: { size: "small" } }}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="payrollTimeframe"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="season-payroll-timeframe-input">
                {intl.formatMessage({
                  id: "seasons.create.form.payroll_timeframe.label",
                  defaultMessage: "Payroll Timeframe",
                })}
                *
              </InputLabel>
              <FormControl>
                <Select
                  {...field}
                  id="season-payroll-timeframe-input"
                  size="small"
                  //   error={!!errors.payrollTimeframe}
                >
                  {payrollTimeframeList?.map(({ value, label }) => {
                    return (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
                {/* <FormHelperText error>
                  {errors.payrollTimeframe?.message}
                </FormHelperText> */}
              </FormControl>
            </Box>
          );
        }}
      />
      {/* TODO: use free solo with text: https://mui.com/material-ui/react-autocomplete/#creatable */}
      <Controller
        control={control}
        name="productId"
        render={({ field: { onChange, value } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <Autocomplete
                id="season-product-combo-box"
                freeSolo
                options={products.map(
                  (product: { _id: string; name: string }) => ({
                    id: product._id,
                    label: product?.name,
                  })
                )}
                value={value ? { id: value, label: value } : undefined}
                onChange={(_, newValue) => {
                  onChange(newValue?.id);
                  setProduct(
                    products?.find(
                      (s: { _id: string }) => s._id === (newValue?.id ?? "")
                    ) ?? null
                  );
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <div>
                    <InputLabel htmlFor="season-product">Product*</InputLabel>
                    <TextField
                      {...params}
                      id="season-product"
                      // helperText={errors.seasonId?.message}
                      // error={!!errors.seasonId}
                    />
                  </div>
                )}
              />
            </Box>
          );
        }}
      />
      {/* TODO: use free solo with text: https://mui.com/material-ui/react-autocomplete/#creatable */}
      <Controller
        control={control}
        name="unitId"
        render={({ field: { onChange, value } }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <Autocomplete
                id="season-unit-combo-box"
                freeSolo
                options={units.map((unit: { _id: string; name: string }) => ({
                  id: unit._id,
                  label: unit?.name,
                }))}
                value={value ? { id: value, label: value } : undefined}
                onChange={(_, newValue) => {
                  onChange(newValue?.id);
                  setUnit(
                    units?.find(
                      (s: { _id: string }) => s._id === (newValue?.id ?? "")
                    ) ?? null
                  );
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <div>
                    <InputLabel htmlFor="season-unit">Unit*</InputLabel>
                    <TextField
                      {...params}
                      id="season-unit"
                      // helperText={errors.seasonId?.message}
                      // error={!!errors.seasonId}
                    />
                  </div>
                )}
              />
            </Box>
          );
        }}
      />

      <Box display="flex" justifyContent="space-between">
        <Button
          disabled={isLoading || isDeleting}
          onClick={seasonId ? hideEdit : onCreateSeasonClose}
        >
          {intl.formatMessage({
            id: "button.cancel",
            defaultMessage: "Cancel",
          })}
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isDirty || isDeleting}
        >
          {intl.formatMessage(
            {
              id: "pickers.button.save",
              defaultMessage:
                "{isLoading, plural, one {Loading...} other {Save} }",
            },
            { isLoading: Number(isLoading) }
          )}
        </Button>
      </Box>

      {/* TODO: add confirmation modal later, we probably will standardize the way we handle the delete after design has defined that */}
      {!!seasonId && (
        <Box display="flex" flexDirection="column" gap={4}>
          <Typography variant="h2">
            {intl.formatMessage({
              id: "danger.zone.label",
              defaultMessage: "Danger Zone",
            })}
          </Typography>
          <Alert
            severity="error"
            variant="outlined"
            action={
              <Button color="error" variant="text" onClick={onDelete}>
                {intl.formatMessage(
                  {
                    id: "pickers.button.delete",
                    defaultMessage:
                      "{isDeleting, plural, one {Deleting...} other {Delete} }",
                  },
                  { isDeleting: Number(isDeleting) }
                )}
              </Button>
            }
            sx={{ display: "flex", alignItems: "center" }}
          >
            {intl.formatMessage({
              id: "pickers.delete.label",
              defaultMessage: "Delete picker data",
            })}
          </Alert>
        </Box>
      )}
    </Box>
  );

  const seasonDetail = (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Button variant="contained" onClick={showEdit}>
          {intl.formatMessage({
            id: "button.edit",
            defaultMessage: "Edit",
          })}
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
      {!isLoadingDetail && <>{showEditForm ? seasonForm : seasonDetail}</>}
    </Drawer>
  );
};

export default SeasonDrawer;
