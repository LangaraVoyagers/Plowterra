import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Drawer,
  DrawerProps,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { getCurrencies } from "api/currencies";
import { createProduct, getProducts } from "api/products";
import {
  closeSeason,
  deleteSeason,
  getSeasonById,
  upsertSeason,
} from "api/seasons";
import { createUnit, getUnits } from "api/units";
import { useAlert } from "context/AlertProvider";
import { useUser } from "context/UserProvider";
import dayjs, { Dayjs } from "dayjs";
import useQueryCache from "hooks/useQueryCache";
import { PayrollTimeframeEnum, StatusEnum } from "project-2-types/dist";
import React from "react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "react-query";
import { BodyText, Display } from "ui/Typography";
import SeasonDeductions from "./SeasonDeductions";
import ConfirmationDrawer from "ui/ConfirmationDrawer";
import SeasonImage from "../../assets/images/SeasonSuccess.svg";
import SelectFreeSolo from "./SelectFreeSolo";
import DrawerContainer from "ui/DrawerContainer";
import InputLabel from "ui/InputLabel";
import Detail from "ui/Detail";
import Tag from "ui/Tag";

const payrollTimeframeList = (
  Object.keys(PayrollTimeframeEnum) as Array<keyof typeof PayrollTimeframeEnum>
).map((key) => ({ value: key, label: PayrollTimeframeEnum[key] }));

type SeasonDrawerProps = DrawerProps & {
  seasonId?: string;
  dismiss: () => void;
};

interface IProduct {
  _id: string;
  name: string;
}

interface IUnit {
  _id: string;
  name: string;
}

interface ICurrency {
  _id: string;
  name: string;
}

interface ISeasonResponse {
  name: string;
  startDate: number;
  endDate: number;
  payrollTimeframe: keyof typeof PayrollTimeframeEnum;
  price: number;
  status: keyof typeof StatusEnum;
  product: IProduct;
  currency: ICurrency;
  unit: IUnit;
  hasHarvestLog: boolean;
  deductions: Array<{ deductionID: string; price: string }>;
}

export interface ISeasonRequest {
  name: string;
  startDate: number;
  payrollTimeframe: keyof typeof PayrollTimeframeEnum;
  price: number;
  farmId: string;
  productId: string;
  unitId: string;
  currencyId: string;
  deductions: Array<{ deductionID: string; price: string }>;
}

const SeasonDrawer = ({ dismiss, seasonId, ...props }: SeasonDrawerProps) => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const { user, defaultSeason, clearDefaultSeason } = useUser();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const {
    GET_DETAIL_QUERY_KEY,
    UPDATE_MUTATION_KEY,
    CREATE_MUTATION_KEY,
    createCache,
    updateCache,
    deleteCache,
  } = useQueryCache("seasons", seasonId);

  const {
    GET_DETAIL_QUERY_KEY: GET_PRODUCTS_KEY,
    createCache: createProductCache,
  } = useQueryCache("products");

  const { GET_DETAIL_QUERY_KEY: GET_UNITS_KEY, createCache: createUnitCache } =
    useQueryCache("units");

  const { GET_DETAIL_QUERY_KEY: GET_CURRENCY_KEY } =
    useQueryCache("currencies");

  const [showEditForm, setShowEditForm] = useState<boolean>(!seasonId);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [products, setProducts] = useState<Array<IProduct>>([]);
  const [currencies, setCurrencies] = useState<Array<ICurrency>>([]);
  const [units, setUnits] = useState<Array<IUnit>>([]);
  const [season, setSeason] = useState<ISeasonResponse>();

  const showEdit = () => setShowEditForm(true);
  const hideEdit = () => {
    setShowEditForm(false);
  };

  const formMethods = useForm<ISeasonRequest>({
    mode: "all",
    defaultValues: {
      name: "",
      startDate: new Date().getTime(),
      farmId: user.farm._id,
      deductions: [
        {
          deductionID: "",
          price: undefined,
        },
      ],
    },
    // resolver: validateResolver(SeasonSchema), TODO: Validate schema
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = formMethods;

  const onCreateSeasonClose = () => {
    reset();
    dismiss();
  };

  // Get season by id
  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: GET_DETAIL_QUERY_KEY,
    queryFn: () => getSeasonById(seasonId),
    enabled: !!seasonId,
    onSuccess: (result) => {
      setSeason(result);
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

  // Get all products
  useQuery({
    queryKey: GET_PRODUCTS_KEY,
    queryFn: getProducts,
    onSuccess: (result) => {
      setProducts(result);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Get all units
  useQuery({
    queryKey: GET_UNITS_KEY,
    queryFn: getUnits,
    onSuccess: (result) => {
      setUnits(result);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Get all currencies
  const { isLoading: isLoadingCurrency } = useQuery({
    queryKey: GET_CURRENCY_KEY,
    queryFn: getCurrencies,
    onSuccess: (result) => {
      setCurrencies(result);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Create or update season
  const { mutate: saveSeasonMutation, isLoading } = useMutation({
    mutationKey: seasonId ? UPDATE_MUTATION_KEY : CREATE_MUTATION_KEY,
    mutationFn: upsertSeason,
    onSuccess: (result) => {
      if (seasonId) {
        handleUpdateSuccess(result);
      } else {
        handleCreateSuccess(result);
      }
      setSeason(result);
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

  // Delete season
  const { mutate: deleteSeasonMutation, isLoading: isDeleting } = useMutation({
    mutationKey: ["season", "delete", seasonId],
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

  // Close season
  const { mutate: closeSeasonMutation, isLoading: isClosing } = useMutation({
    mutationKey: ["season", "close", seasonId],
    mutationFn: closeSeason,
    onSuccess: (result) => {
      updateCache(result);
      showAlert(
        intl.formatMessage({
          id: "seasons.close.season.response.success",
          defaultMessage: "The season was closed successfully.",
        }),
        "success"
      );
      if (result._id === defaultSeason) {
        clearDefaultSeason();
        showAlert(
          intl.formatMessage({
            id: "seasons.close.season.clear.default.season",
            defaultMessage:
              "The default season was closed, you can select a new default season on the Seasons page",
          }),
          "info"
        );
      }

      dismiss();
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "seasons.close.season.response.error",
          defaultMessage: "Oops! The season couldn't be closed.",
        }),
        "error"
      );
    },
  });

  const handleCreateSuccess = (created: ISeasonResponse & { _id: string }) => {
    createCache(created);
    setShowSuccess(true);
    dismiss();
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

  const onSubmit = (data: ISeasonRequest) => {
    saveSeasonMutation({
      ...data,
      seasonId: seasonId,
      deductions: data.deductions
        .map(({ deductionID, price }) => ({
          deductionID,
          price: +price || 0,
        }))
        .filter((d) => !!d.deductionID),
    });
  };

  const onDelete = () => {
    deleteSeasonMutation(seasonId);
  };

  const onClose = () => {
    closeSeasonMutation(seasonId);
  };

  const handleClose = (
    _event: React.MouseEvent,
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (!showEditForm) {
      if (reason === "backdropClick" || reason === "escapeKeyDown") {
        dismiss();
      }
    }
  };

  const seasonForm = (
    <FormProvider {...formMethods}>
      <DrawerContainer
        footer={
          <Box display="flex" justifyContent="space-between">
            <Button
              disabled={isLoading || isDeleting}
              onClick={seasonId ? hideEdit : onCreateSeasonClose}
              variant="outlined"
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
        }
      >
        <Display component="h1" size="md" fontWeight="SemiBold">
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
                <InputLabel htmlFor="season-name-input" required>
                  {intl.formatMessage({
                    id: "seasons.create.form.name.label",
                    defaultMessage: "Harvest Season Name",
                  })}
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
                <InputLabel htmlFor="season-start-date-input" required>
                  {intl.formatMessage({
                    id: "seasons.create.form.start_date.label",
                    defaultMessage: "Start Date",
                  })}
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
                <InputLabel htmlFor="season-payroll-timeframe-input" required>
                  {intl.formatMessage({
                    id: "seasons.create.form.payroll_timeframe.label",
                    defaultMessage: "Payroll Timeframe",
                  })}
                </InputLabel>
                <FormControl>
                  <Select
                    {...field}
                    id="season-payroll-timeframe-input"
                    size="small"
                    error={!!errors.payrollTimeframe}
                  >
                    {payrollTimeframeList?.map(({ value, label }) => {
                      return (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText error>
                    {errors.payrollTimeframe?.message}
                  </FormHelperText>
                </FormControl>
              </Box>
            );
          }}
        />

        <Controller
          control={control}
          name="productId"
          render={({ field: { onChange, value: productId } }) => {
            return (
              <Box display="flex" flexDirection="column" gap={1}>
                <InputLabel htmlFor="select-product-input" required>
                  {intl.formatMessage({
                    id: "seasons.create.form.product.label",
                    defaultMessage: "Product",
                  })}
                </InputLabel>
                <SelectFreeSolo
                  sx={{ width: "100%" }}
                  options={products.map((p) => ({
                    id: p._id,
                    label: p.name,
                  }))}
                  defaultValue={{
                    id: productId,
                    label:
                      products.find((d) => d._id === productId)?.name ?? "",
                  }}
                  onCreate={async (value) => {
                    try {
                      const data = await createProduct(value);

                      createProductCache(data);
                      onChange(data?._id);
                      return data?._id;
                    } catch (error) {
                      return "";
                    }
                  }}
                  onChange={({ id }) => {
                    if (id) {
                      onChange(id);
                    }
                  }}
                  id="select-product-input"
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name="unitId"
          render={({ field: { onChange, value: unitId } }) => {
            return (
              <Box display="flex" flexDirection="column" gap={1}>
                <InputLabel htmlFor="season-unit-combo-box" required>
                  {intl.formatMessage({
                    id: "seasons.create.form.unit.label",
                    defaultMessage: "Unit",
                  })}
                </InputLabel>
                <SelectFreeSolo
                  sx={{ width: "100%" }}
                  options={units.map((unit) => ({
                    id: unit._id,
                    label: unit?.name,
                  }))}
                  defaultValue={{
                    id: unitId,
                    label: units.find((u) => u._id === unitId)?.name ?? "",
                  }}
                  onCreate={async (value) => {
                    try {
                      const data = await createUnit(value);

                      createUnitCache(data);
                      onChange(data?._id);
                      return data?._id;
                    } catch (error) {
                      return "";
                    }
                  }}
                  onChange={({ id }) => {
                    if (id) {
                      onChange(id);
                    }
                  }}
                  id="season-unit-combo-box"
                />
              </Box>
            );
          }}
        />

        <Controller
          control={control}
          name="currencyId"
          render={({ field: { onChange, value } }) => {
            return (
              <Box display="flex" flexDirection="column" gap={1}>
                <Autocomplete
                  id="season-currency-combo-box"
                  options={currencies.map((currency) => ({
                    id: currency._id,
                    label: currency.name,
                  }))}
                  // TODO: use free solo with text: https://mui.com/material-ui/react-autocomplete/#creatable
                  value={
                    value
                      ? {
                          id: value,
                          label: currencies.find((c) => c._id)?.name,
                        }
                      : undefined
                  }
                  onChange={(_, newValue) => {
                    onChange(newValue?.id);
                  }}
                  loading={isLoadingCurrency}
                  renderInput={(params) => (
                    <div>
                      <InputLabel htmlFor="season-currency" required>
                        {intl.formatMessage({
                          id: "seasons.create.form.currency.label",
                          defaultMessage: "Currency",
                        })}
                      </InputLabel>
                      <TextField
                        {...params}
                        size="small"
                        id="season-currency"
                        helperText={errors.currencyId?.message}
                        error={!!errors.currencyId}
                      />
                    </div>
                  )}
                />
              </Box>
            );
          }}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { ref, value, onChange } }) => {
            return (
              <Box display="flex" flexDirection="column" gap={1}>
                <InputLabel htmlFor="season-price-input" required>
                  {intl.formatMessage({
                    id: "seasons.create.form.price.label",
                    defaultMessage: "Price per Unit",
                  })}
                </InputLabel>
                <TextField
                  ref={ref}
                  value={value}
                  onChange={({ target }) => {
                    onChange(target.value);
                  }}
                  type="number"
                  id="season-price-input"
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Box>
            );
          }}
        />

        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="">
            {intl.formatMessage({
              id: "seasons.create.form.deductions.label",
              defaultMessage: "Deductions",
            })}
          </InputLabel>
          <SeasonDeductions />
        </Box>

        {/* TODO: add confirmation modal later, we probably will standardize the way we handle the delete after design has defined that */}
        {!!seasonId && (
          <Box display="flex" flexDirection="column" gap={2} marginTop={4}>
            <Alert
              severity="error"
              variant="outlined"
              action={
                <Button
                  color="error"
                  variant="text"
                  onClick={onDelete}
                  size="small"
                >
                  {intl.formatMessage(
                    {
                      id: "seasons.button.delete",
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
                id: "seasons.delete.label",
                defaultMessage: "Delete harvest season data",
              })}
            </Alert>
          </Box>
        )}
      </DrawerContainer>
    </FormProvider>
  );

  const createSeasonDataList = React.useCallback(() => {
    return [
      [
        intl.formatMessage({
          id: "season.view.detail.start_date.label",
          defaultMessage: "Start Date",
        }),
        intl.formatDate(season?.startDate, {
          year: "numeric",
          month: "long",
          day: "2-digit",
        }),
      ],
      [
        intl.formatMessage({
          id: "season.view.detail.end_date.label",
          defaultMessage: "End Date",
        }),
        season?.endDate
          ? intl.formatDate(season?.endDate, {
              year: "numeric",
              month: "long",
              day: "2-digit",
            })
          : "-",
      ],
      [
        intl.formatMessage({
          id: "season.view.detail.timeframe.label",
          defaultMessage: "Payroll Timeframe",
        }),
        (season?.payrollTimeframe &&
          PayrollTimeframeEnum[season?.payrollTimeframe]) ||
          "",
      ],
      [
        intl.formatMessage({
          id: "season.view.detail.product.label",
          defaultMessage: "Product",
        }),
        season?.product?.name || "",
      ],
      [
        intl.formatMessage({
          id: "season.view.detail.unit.label",
          defaultMessage: "Unit",
        }),
        season?.unit?.name || "",
      ],
      [
        <Box key="price_per_unit" display="flex" gap={1} alignItems="center">
          {intl.formatMessage({
            id: "season.view.detail.price_per_unit.label",
            defaultMessage: "Price Per Unit",
          })}
          <Tag>{season?.currency.name}</Tag>
        </Box>,
        season?.price || "",
      ],
      // add deduction name to display
      [
        <Box key="deductions" display="flex" gap={1} alignItems="center">
          {intl.formatMessage({
            id: "season.view.detail.deductions.label",
            defaultMessage: "Deductions",
          })}
          <Tag>{season?.currency.name}</Tag>
        </Box>,
        <Stack direction="row" spacing={1} key="season-deductions">
          {season?.deductions.map(({ price }, index) => {
            return <Chip key={index} label={price} size="small" />;
          })}
        </Stack>,
      ],
      [
        intl.formatMessage({
          id: "season.view.detail.status.label",
          defaultMessage: "Status",
        }),
        season?.status ? StatusEnum[season?.status] : "",
      ],
      [
        <Box key="production_total" display="flex" gap={1} alignItems="center">
          {intl.formatMessage({
            id: "season.view.detail.production_total.label",
            defaultMessage: "Production Total",
          })}
          <Tag>{season?.currency.name}</Tag>
        </Box>,
        0,
      ],
    ];
  }, [season]);
  const createSubTotals = React.useCallback(() => {
    return [
      [
        <Box key="gross_total" display="flex" gap={1} alignItems="center">
          {intl.formatMessage({
            id: "season.view.detail.gross_total.label",
            defaultMessage: "Gross Total",
          })}
          <Tag>{season?.currency.name}</Tag>
        </Box>,
        0,
      ],
      [
        <Box key="deductions_total" display="flex" gap={1} alignItems="center">
          {intl.formatMessage({
            id: "season.view.detail.deductions_total.label",
            defaultMessage: "Deductions Total",
          })}
          <Tag>{season?.currency.name}</Tag>
        </Box>,
        0,
      ],
    ];
  }, [season]);
  const createTotal = React.useCallback(() => {
    return [
      [
        <Box key="net_payment" display="flex" gap={1} alignItems="center">
          {intl.formatMessage({
            id: "season.view.detail.net_payment.label",
            defaultMessage: "Net Payment",
          })}
          <Tag>{season?.currency.name}</Tag>
        </Box>,
        0,
      ],
    ];
  }, [season]);

  const seasonDetail = (
    <DrawerContainer
      paddingX="0"
      footer={
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onCreateSeasonClose}>
            {intl.formatMessage({
              id: "button.back",
              defaultMessage: "Back",
            })}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              reset({
                name: season?.name,
                farmId: user.farm._id,
                startDate: season?.startDate,
                productId: season?.product._id,
                currencyId: season?.currency._id,
                unitId: season?.unit._id,
                payrollTimeframe: season?.payrollTimeframe,
                price: season?.price,
                deductions: season?.deductions ?? [],
              });
              showEdit();
            }}
          >
            {intl.formatMessage({
              id: "button.edit",
              defaultMessage: "Edit",
            })}
          </Button>
        </Box>
      }
    >
      <Detail
        category={intl.formatMessage({
          id: "seasons.view.detail.season.label",
          defaultMessage: "Season",
        })}
        title={season?.name}
        data={createSeasonDataList()}
        subfooter={createSubTotals()}
        footer={createTotal()}
      />

      {/* TODO: add confirmation modal later, we probably will standardize the way we handle the delete after design has defined that */}
      {!!seasonId && season?.status.toUpperCase() !== "CLOSED" && (
        <Box
          display="flex"
          flexDirection="column"
          gap="1.25rem"
          paddingX="1.5rem"
        >
          <BodyText size="md" component="h2" fontWeight="SemiBold">
            {intl.formatMessage({
              id: "seasons.view.detail.close.season.label",
              defaultMessage: "Close Season",
            })}
          </BodyText>
          <Box
            display="flex"
            gap="1rem"
            justifyContent="space-between"
            flexWrap="wrap"
            alignItems="center"
          >
            <Box>
              {intl.formatMessage({
                id: "season.close.description",
                defaultMessage:
                  "After closing this season, this cannot be updated, and you will not be able to add more harvest logs.",
              })}
            </Box>

            <Button
              color="info"
              variant="outlined"
              onClick={onClose}
              size="small"
              sx={{ flexShrink: 0 }}
            >
              {intl.formatMessage(
                {
                  id: "season.button.close",
                  defaultMessage:
                    "{isClosing, plural, one {Loading...} other {Close season} }",
                },
                { isClosing: Number(isClosing) }
              )}
            </Button>
          </Box>
        </Box>
      )}
    </DrawerContainer>
  );

  return (
    <>
      <Drawer
        anchor="right"
        PaperProps={{
          sx: {
            width: desktop ? 500 : "100%",
          },
        }}
        {...props}
        onClose={handleClose}
      >
        {!isLoadingDetail && <>{showEditForm ? seasonForm : seasonDetail}</>}
      </Drawer>
      {!!showSuccess && (
        <ConfirmationDrawer
          open
          image={SeasonImage}
          title={intl.formatMessage({
            id: "seasons.create.season.success.drawer.title",
            defaultMessage: "New Season Created!",
          })}
          message={intl.formatMessage(
            {
              id: "seasons.create.season.success.drawer.message",
              defaultMessage: `Harvest season {seasonName} has been created.`,
            },
            {
              seasonName: (
                <BodyText
                  component="span"
                  fontWeight="Bold"
                  color="secondary-700"
                >
                  {formMethods.getValues("name")}
                </BodyText>
              ),
            }
          )}
          backButtonTitle={intl.formatMessage({
            id: "seasons.create.season.success.drawer.back.button",
            defaultMessage: "Back to Harvest Season",
          })}
          onClose={() => {
            setShowSuccess(false);
            onCreateSeasonClose();
          }}
        />
      )}
    </>
  );
};

export default SeasonDrawer;
