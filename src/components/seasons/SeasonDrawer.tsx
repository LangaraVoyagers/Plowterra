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
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { getCurrencies } from "api/currencies"
import { getProducts } from "api/products"
import {
  closeSeason,
  deleteSeason,
  getSeasonById,
  upsertSeason,
} from "api/seasons"
import { getUnits } from "api/units"
import { useAlert } from "context/AlertProvider"
import { useUser } from "context/UserProvider"
import dayjs, { Dayjs } from "dayjs"
import useQueryCache from "hooks/useQueryCache"
import { PayrollTimeframeEnum, StatusEnum } from "project-2-types/dist"
import React from "react"
import { useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useIntl } from "react-intl"
import { useMutation, useQuery } from "react-query"
import { Display, Label } from "ui/Typography"
import SeasonDeductions from "./SeasonDeductions"

function formatDate(date: number): string {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  return formattedDate
}

const payrollTimeframeList = (
  Object.keys(PayrollTimeframeEnum) as Array<keyof typeof PayrollTimeframeEnum>
).map((key) => ({ value: key, label: PayrollTimeframeEnum[key] }))

type SeasonDrawerProps = DrawerProps & {
  seasonId?: string;
  dismiss: (success: boolean, button: 'confirm' | 'cancel', data: any) => void;
}

interface IProduct {
  _id: string
  name: string
}

interface IUnit {
  _id: string
  name: string
}

interface ICurrency {
  _id: string
  name: string
}

interface ISeasonResponse {
  name: string
  startDate: number
  endDate: number
  payrollTimeframe: keyof typeof PayrollTimeframeEnum
  price: number
  status: keyof typeof StatusEnum
  product: IProduct
  currency: ICurrency
  unit: IUnit
  hasHarvestLog: boolean
  deductions: Array<{ deductionID: string; price: string }>
}

export interface ISeasonRequest {
  name: string
  startDate: number
  payrollTimeframe: keyof typeof PayrollTimeframeEnum
  price: number
  farmId: string
  productId: string
  unitId: string
  currencyId: string
  deductions: Array<{ deductionID: string; price: string }>
}

const SeasonDrawer = ({ dismiss, seasonId, ...props }: SeasonDrawerProps) => {
  const intl = useIntl()
  const { showAlert } = useAlert()
  const { user } = useUser()
  const {
    GET_DETAIL_QUERY_KEY,
    UPDATE_MUTATION_KEY,
    CREATE_MUTATION_KEY,
    createCache,
    updateCache,
    deleteCache,
  } = useQueryCache("seasons", seasonId)

  const { GET_DETAIL_QUERY_KEY: GET_PRODUCTS_KEY } = useQueryCache("products")

  const { GET_DETAIL_QUERY_KEY: GET_UNITS_KEY } = useQueryCache("units")

  const { GET_DETAIL_QUERY_KEY: GET_CURRENCY_KEY } = useQueryCache("currencies")

  const [showEditForm, setShowEditForm] = useState<boolean>(!seasonId)

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs())
  const [products, setProducts] = useState<Array<IProduct>>([])
  const [currencies, setCurrencies] = useState<Array<ICurrency>>([])
  const [units, setUnits] = useState<Array<IUnit>>([])
  const [season, setSeason] = useState<ISeasonResponse>()

  const showEdit = () => setShowEditForm(true)
  const hideEdit = () => {
    dismiss(false, 'cancel', null);
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
  })
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = formMethods

  const onCreateSeasonClose = () => {
    reset()
    dismiss(false, 'cancel', null);
  }

  // Get season by id
  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: GET_DETAIL_QUERY_KEY,
    queryFn: () => getSeasonById(seasonId),
    enabled: !!seasonId,
    onSuccess: (result) => {
      setSeason(result)
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "season.detail.error",
          defaultMessage: "Oops! Information couldn't be displayed.",
        }),
        "error"
      )
    },
  })

  // Get all products
  const { isLoading: isLoadingProducts } = useQuery({
    queryKey: GET_PRODUCTS_KEY,
    queryFn: getProducts,
    onSuccess: (result) => {
      setProducts(result)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  // Get all units
  const { isLoading: isLoadingUnits } = useQuery({
    queryKey: GET_UNITS_KEY,
    queryFn: getUnits,
    onSuccess: (result) => {
      setUnits(result)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  // Get all currencies
  const { isLoading: isLoadingCurrency } = useQuery({
    queryKey: GET_CURRENCY_KEY,
    queryFn: getCurrencies,
    onSuccess: (result) => {
      setCurrencies(result)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  // Create or update season
  const { mutate: saveSeasonMutation, isLoading } = useMutation({
    mutationKey: seasonId ? UPDATE_MUTATION_KEY : CREATE_MUTATION_KEY,
    mutationFn: upsertSeason,
    onSuccess: (result) => {
      if (seasonId) {
        handleUpdateSuccess(result)
      } else {
        handleCreateSuccess(result)
      }
      setSeason(result)
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "seasons.create.season.response.error",
          defaultMessage: "Oops! The season couldn't be saved.",
        }),
        "error"
      )
    },
  })

  // Delete season
  const { mutate: deleteSeasonMutation, isLoading: isDeleting } = useMutation({
    mutationKey: ["season", "delete", seasonId],
    mutationFn: deleteSeason,
    onSuccess: (result) => {
      deleteCache(result)
      showAlert(
        intl.formatMessage({
          id: "seasons.delete.season.response.success",
          defaultMessage: "The season was deleted successfully.",
        }),
        "success"
      )
      dismiss(true, 'confirm', null)
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "seasons.delete.season.response.error",
          defaultMessage: "Oops! The season couldn't be deleted.",
        }),
        "error"
      )
    },
  })

  // Close season
  const { mutate: closeSeasonMutation, isLoading: isClosing } = useMutation({
    mutationKey: ["season", "close", seasonId],
    mutationFn: closeSeason,
    onSuccess: (result) => {
      updateCache(result)
      showAlert(
        intl.formatMessage({
          id: "seasons.close.season.response.success",
          defaultMessage: "The season was close successfully.",
        }),
        "success"
      )
      dismiss(true, 'confirm', null)
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "seasons.close.season.response.error",
          defaultMessage: "Oops! The season couldn't be closed.",
        }),
        "error"
      )
    },
  })

  const handleCreateSuccess = (created: ISeasonResponse & { _id: string }) => {
    createCache(created)
    showAlert(
      intl.formatMessage({
        id: "seasons.create.season.response.success",
        defaultMessage: "The season was created successfully",
      }),
      "success"
    )
    onCreateSeasonClose()
  }

  const handleUpdateSuccess = (updated: ISeasonResponse & { _id: string }) => {
    updateCache(updated)
    showAlert(
      intl.formatMessage({
        id: "seasons.update.season.response.success",
        defaultMessage: "The season was updated successfully",
      }),
      "success"
    )
    hideEdit()
  }
  const onSubmit = (data: ISeasonRequest) => {
    saveSeasonMutation({
      ...data,
      seasonId: seasonId,
      deductions: data.deductions.map(({ deductionID, price }) => ({
        deductionID,
        price: +price || 0,
      })),
    });
  
    dismiss(true, 'confirm', data);
  };

  const onDelete = () => {
    deleteSeasonMutation(seasonId)
  }

  const onClose = () => {
    closeSeasonMutation(seasonId)
  }

  const handleClose = (_event: React.MouseEvent, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (!showEditForm) {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        dismiss(false, 'cancel', null);
      }
    }
  };
  
  
  const seasonForm = (
    <FormProvider {...formMethods}>
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
            )
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
                    setStartDate(newValue)
                  }}
                />
              </Box>
            )
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
                    error={!!errors.payrollTimeframe}
                  >
                    {payrollTimeframeList?.map(({ value, label }) => {
                      return (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      )
                    })}
                  </Select>
                  <FormHelperText error>
                    {errors.payrollTimeframe?.message}
                  </FormHelperText>
                </FormControl>
              </Box>
            )
          }}
        />

        <Controller
          control={control}
          name="productId"
          render={({ field: { onChange, value } }) => {
            return (
              <Box display="flex" flexDirection="column" gap={1}>
                <Autocomplete
                  id="season-product-combo-box"
                  options={products.map((product) => ({
                    id: product._id,
                    label: product.name,
                  }))}
                  loading={isLoadingProducts}
                  // TODO: use free solo with text: https://mui.com/material-ui/react-autocomplete/#creatable
                  value={
                    value
                      ? {
                          id: value,
                          label: products.find((p) => p._id === value)?.name,
                        }
                      : undefined
                  }
                  onChange={(_, newValue) => {
                    onChange(newValue?.id)
                  }}
                  renderInput={(params) => (
                    <div>
                      <InputLabel htmlFor="season-product">Product*</InputLabel>
                      <TextField
                        {...params}
                        id="season-product"
                        size="small"
                        helperText={errors.productId?.message}
                        error={!!errors.productId}
                      />
                    </div>
                  )}
                />
              </Box>
            )
          }}
        />
        <Controller
          control={control}
          name="unitId"
          render={({ field: { onChange, value } }) => {
            return (
              <Box display="flex" flexDirection="column" gap={1}>
                <Autocomplete
                  id="season-unit-combo-box"
                  options={units.map((unit) => ({
                    id: unit._id,
                    label: unit?.name,
                  }))}
                  loading={isLoadingUnits}
                  // TODO: use free solo with text: https://mui.com/material-ui/react-autocomplete/#creatable
                  value={
                    value
                      ? {
                          id: value,
                          label: units.find((u) => u._id === value)?.name,
                        }
                      : undefined
                  }
                  onChange={(_, newValue) => {
                    onChange(newValue?.id)
                  }}
                  renderInput={(params) => (
                    <div>
                      <InputLabel htmlFor="season-unit">Unit*</InputLabel>
                      <TextField
                        {...params}
                        id="season-unit"
                        size="small"
                        helperText={errors.unitId?.message}
                        error={!!errors.unitId}
                      />
                    </div>
                  )}
                />
              </Box>
            )
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
                    onChange(newValue?.id)
                  }}
                  loading={isLoadingCurrency}
                  renderInput={(params) => (
                    <div>
                      <InputLabel htmlFor="season-currency">
                        Currency*
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
            )
          }}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { ref, value, onChange } }) => {
            return (
              <Box display="flex" flexDirection="column" gap={1}>
                <InputLabel htmlFor="season-price-input">
                  {intl.formatMessage({
                    id: "seasons.create.form.price.label",
                    defaultMessage: "Price per Unit",
                  })}
                  *
                </InputLabel>
                <TextField
                  ref={ref}
                  value={value}
                  onChange={({ target }) => {
                    if (target.value) {
                      onChange(+target.value)
                    } else {
                      onChange(undefined)
                    }
                  }}
                  id="season-price-input"
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Box>
            )
          }}
        />

        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel>
            {intl.formatMessage({
              id: "seasons.create.form.deductions.label",
              defaultMessage: "Deductions",
            })}
          </InputLabel>
          <SeasonDeductions />
        </Box>

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
          <Box display="flex" flexDirection="column" gap={2} marginTop={4}>
            <Display size="sm" component="h2">
              {intl.formatMessage({
                id: "danger.zone.label",
                defaultMessage: "Danger Zone",
              })}
            </Display>
            <Alert
              severity="error"
              variant="outlined"
              action={
                <Button color="error" variant="text" onClick={onDelete}>
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
      </Box>
    </FormProvider>
  )

  const createSeasonDataList = React.useCallback(() => {
    return [
      ["Start Date", formatDate(season?.startDate || 0)],
      ["End Date", formatDate(season?.endDate || 0)],
      [
        "Payroll Timeframe",
        (season?.payrollTimeframe &&
          PayrollTimeframeEnum[season?.payrollTimeframe]) ||
          "",
      ],
      ["Product", season?.product?.name || ""],
      ["Unit", season?.unit?.name || ""],
      ["Price Per Unit", season?.price || ""],
      // add deduction name to display
      [
        "Deductions",
        <Stack direction="row" spacing={1} key="season-deductions">
          {season?.deductions.map(({ price }, index) => {
            return <Chip key={index} label={price} size="small" />
          })}
        </Stack>,
      ],
      ["Status", season?.status ? StatusEnum[season?.status] : ""],
      ["Production Total", 0],
      ["Gross Total", 0],
      ["Deductions Total", 0],
      ["Net Payment", 0],
    ]
  }, [season])

  const seasonDetail = (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      padding="3rem"
      width={600}
      height="100%"
      flex={1}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        flex={1}
        justifyContent="flex-start"
      >
        <Box display="flex" flexDirection="column">
          <Label>Season</Label>
          <Display>{season?.name}</Display>
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
                {createSeasonDataList().map((row, index) => (
                  <TableRow key={index}>
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
      </Box>
      <Box display="flex" justifyContent="space-between" paddingBottom="3rem">
        <Button variant="outlined" onClick={onCreateSeasonClose}>
          Back
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
            })
            showEdit()
          }}
        >
          Edit
        </Button>
      </Box>
      {/* TODO: add confirmation modal later, we probably will standardize the way we handle the delete after design has defined that */}
      {!!seasonId && (
        <Box display="flex" flexDirection="column" gap={2} paddingBottom="3rem">
          <Display size="sm" component="h2">
            {intl.formatMessage(
              {
                id: "close.season.zone.label",
                defaultMessage:
                  "{isClosing, plural, one {Loading...} other {Close season} }",
              },
              { isClosing: Number(isClosing) }
            )}
          </Display>
          <Alert
            severity="info"
            variant="outlined"
            action={
              <Button
                color="info"
                variant="text"
                onClick={onClose}
                sx={{ flexShrink: 0 }}
              >
                {intl.formatMessage({
                  id: "season.button.close",
                  defaultMessage: "Close Season",
                })}
              </Button>
            }
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box maxWidth={300}>
              {intl.formatMessage({
                id: "season.close.description",
                defaultMessage:
                  "After closing this season, this cannot be updated, and you will not be able to add more harvest logs.",
              })}
            </Box>
          </Alert>
        </Box>
      )}
    </Box>
  )

  return (
    <Drawer
      anchor="right"
      {...props}
      onClose={handleClose}
    >
      {!isLoadingDetail && <>{showEditForm ? seasonForm : seasonDetail}</>}
    </Drawer>
  );
}

export default SeasonDrawer
