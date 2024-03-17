import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  BloodType,
  IPickerResponse,
  Relationship,
} from "project-2-types/dist/interface"
import { Controller, useForm } from "react-hook-form";
import { deletePicker, getPickerById, upsertPicker } from "api/pickers";
import { useMutation, useQuery } from "react-query";

import PickerSchema from "project-2-types/dist/ajv/picker.ajv";
import { useAlert } from "context/AlertProvider";
import { useIntl } from "react-intl";
import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";
import { validateResolver } from "shared/ajv";
import { BodyText, Display, Label } from "ui/Typography";
import { useNavigate } from "react-router-dom";
import paths from "shared/paths";

interface IPickerForm extends Omit<IPickerResponse, "id"> {}

const relationshipList = (
  Object.keys(Relationship) as Array<keyof typeof Relationship>
).map((key) => ({ value: key, label: Relationship[key] }))

const bloodTypeList = (
  Object.keys(BloodType) as Array<keyof typeof BloodType>
).map((key) => ({ value: key, label: BloodType[key] }))

type PickerDrawerProps = DrawerProps & {
  pickerId?: string
  dismiss: (success: boolean, button: 'confirm' | 'cancel', data: any) => void;
}
const PickerDrawer = ({ dismiss, pickerId, ...props }: PickerDrawerProps) => {
  const intl = useIntl()
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  const {
    GET_DETAIL_QUERY_KEY,
    UPDATE_MUTATION_KEY,
    CREATE_MUTATION_KEY,
    createCache,
    updateCache,
    deleteCache,
  } = useQueryCache("pickers", pickerId)

  const [showEditForm, setShowEditForm] = useState<boolean>(!pickerId)

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<IPickerForm>({
    mode: "all",
    defaultValues: {
      name: "",
      phone: "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "FAMILY",
      },
    },
    resolver: validateResolver(PickerSchema),
  })

  const pickerData = getValues()

  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: GET_DETAIL_QUERY_KEY,
    queryFn: () => getPickerById(pickerId),
    enabled: !!pickerId,
    onSuccess: (result) => {
      reset(result)
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "pickers.detail.error",
          defaultMessage: "Oops! Information couldn't be displayed.",
        }),
        "error"
      )
    },
  })

  const { mutate: savePickerMutation, isLoading } = useMutation({
    mutationKey: pickerId ? UPDATE_MUTATION_KEY : CREATE_MUTATION_KEY,
    mutationFn: upsertPicker,
    onSuccess: (result) => {
      if (pickerId) {
        handleUpdateSuccess(result)
      } else {
        handleCreateSuccess(result)
      }
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "pickers.create.picker.response.error",
          defaultMessage: "Oops! The picker couldn't be saved.",
        }),
        "error"
      )
    },
  })

  const onCreatePickerClose = () => {
    reset()
    dismiss(false, 'cancel', null);
  }

  const handleCreateSuccess = (created: IPickerResponse) => {
    createCache(created)
    showAlert(
      intl.formatMessage({
        id: "pickers.create.picker.response.success",
        defaultMessage: "The picker was created successfully",
      }),
      "success"
    )
    onCreatePickerClose()
  }

  const handleUpdateSuccess = (updated: IPickerResponse) => {
    updateCache(updated)
    showAlert(
      intl.formatMessage({
        id: "pickers.update.picker.response.success",
        defaultMessage: "The picker was updated successfully",
      }),
      "success"
    )
    hideEdit()
  }

  const { mutate: deletePickerMutation, isLoading: isDeleting } = useMutation({
    mutationKey: ["pickers", "delete", pickerId],
    mutationFn: deletePicker,
    onSuccess: (result) => {
      deleteCache(result)
      showAlert(
        intl.formatMessage({
          id: "pickers.delete.picker.response.success",
          defaultMessage: "The picker was deleted successfully.",
        }),
        "success"
      )
      dismiss(true, 'confirm', null);
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "pickers.delete.picker.response.error",
          defaultMessage: "Oops! The picker couldn't be deleted.",
        }),
        "error"
      )
    },
  })

  const onSubmit = (data: IPickerForm) => {
    savePickerMutation({ ...data, pickerId })
    dismiss(true, 'confirm', data);
  }

  const onDelete = () => {
    deletePickerMutation(pickerId)
  }

  const showEdit = () => setShowEditForm(true)
  const hideEdit = () => setShowEditForm(false)

  const handleClose = (_event: React.MouseEvent, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (!showEditForm) {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        dismiss(false, 'cancel', null);
      }
    }
  };

  const pickerForm = (
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
            id: "pickers.detail.title",
            defaultMessage:
              "{isEdit, plural, one {Edit Picker} other {Add Picker} }",
          },
          { isEdit: Number(!!pickerId) }
        )}
      </Display>
      <Controller
        control={control}
        name="name"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-name-input">
                {intl.formatMessage({
                  id: "pickers.create.form.name.label",
                  defaultMessage: "Name",
                })}
                *
              </InputLabel>
              <TextField
                {...field}
                id="picker-name-input"
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
        name="phone"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-phone-input">
                {intl.formatMessage({
                  id: "pickers.create.form.phone_number.label",
                  defaultMessage: "Phone Number",
                })}
                *
              </InputLabel>

              <TextField
                {...field}
                id="picker-phone-input"
                size="small"
                variant="outlined"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Box>
          )
        }}
      />

      <Controller
        control={control}
        name="emergencyContact.name"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-contact-name-input">
                {intl.formatMessage({
                  id: "pickers.create.form.emergency_contact_name.label",
                  defaultMessage: "Emergency Contact Name",
                })}
                *
              </InputLabel>

              <TextField
                {...field}
                id="picker-contact-name-input"
                size="small"
                variant="outlined"
                error={!!errors.emergencyContact?.name?.message}
                helperText={errors.emergencyContact?.name?.message}
              />
            </Box>
          )
        }}
      />

      <Controller
        control={control}
        name="emergencyContact.relationship"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-relation-input">
                {intl.formatMessage({
                  id: "pickers.create.form.relation_to_picker.label",
                  defaultMessage: "Relation to picker",
                })}
                *
              </InputLabel>
              <FormControl>
                <Select
                  {...field}
                  id="picker-relation-input"
                  size="small"
                  error={!!errors.emergencyContact?.relationship}
                >
                  {relationshipList?.map(({ value, label }) => {
                    return (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    )
                  })}
                </Select>
                <FormHelperText error>
                  {errors.emergencyContact?.relationship?.message}
                </FormHelperText>
              </FormControl>
            </Box>
          )
        }}
      />

      <Controller
        control={control}
        name="emergencyContact.phone"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-contact-number-input">
                {intl.formatMessage({
                  id: "pickers.create.form.emergency_contact_number.label",
                  defaultMessage: "Emergency Contact Number",
                })}
                *
              </InputLabel>

              <TextField
                {...field}
                id="picker-contact-number-input"
                size="small"
                variant="outlined"
                sx={{ flex: 1 }}
                error={!!errors.emergencyContact?.phone}
                helperText={errors.emergencyContact?.phone?.message}
              />
            </Box>
          )
        }}
      />

      <Controller
        control={control}
        name="bloodType"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-blook-type-input">
                {intl.formatMessage({
                  id: "pickers.create.form.blood_type.label",
                  defaultMessage: "Blood Type",
                })}
              </InputLabel>

              <FormControl>
                <Select
                  {...field}
                  id="picker-blood-type-input"
                  size="small"
                  error={!!errors.bloodType}
                >
                  {bloodTypeList?.map(({ value, label }) => {
                    return (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    )
                  })}
                </Select>
                <FormHelperText error>
                  {errors.bloodType?.message}
                </FormHelperText>
              </FormControl>
            </Box>
          )
        }}
      />

      <Controller
        control={control}
        name="govId"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-gov-id-input">
                {intl.formatMessage({
                  id: "pickers.create.form.identification_number.label",
                  defaultMessage: "Identification Number",
                })}
              </InputLabel>

              <TextField
                {...field}
                id="picker-gov-id-input"
                size="small"
                variant="outlined"
                error={!!errors.govId}
                helperText={errors.govId?.message}
              />
            </Box>
          )
        }}
      />

      <Controller
        control={control}
        name="address"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-address-input">
                {intl.formatMessage({
                  id: "pickers.create.form.address.label",
                  defaultMessage: "Address",
                })}
              </InputLabel>

              <TextField
                {...field}
                id="picker-address-input"
                multiline
                rows={2}
                variant="outlined"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Box>
          )
        }}
      />

      <Box display="flex" justifyContent="space-between">
        <Button
          disabled={isLoading || isDeleting}
          onClick={pickerId ? hideEdit : onCreatePickerClose}
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
          disabled={isLoading || isDeleting}
        >
          {intl.formatMessage(
            {
              id: "pickers.button.save",
              defaultMessage:
                "{isLoading, plural, one {Loading...} other {Confirm} }",
            },
            { isLoading: Number(isLoading) }
          )}
        </Button>
      </Box>

      {/* TODO: add confirmation modal later, we probably will standardize the way we handle the delete after design has defined that */}
      {!!pickerId && (
        <Box display="flex" flexDirection="column" mt={4}>
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
              <Button
                color="error"
                size="small"
                variant="text"
                onClick={onDelete}
              >
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
  )

  const pickerDetail = (
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
          <Display>{pickerData.name}</Display>
          <BodyText>{pickerData.phone}</BodyText>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Label component="label" htmlFor="emergency-contact-name">
            {intl.formatMessage({
              id: "pickers.detail.emergency_contact_person.label",
              defaultMessage: "Emergency Contact Person",
            })}
          </Label>
          <BodyText fontWeight="Medium" id="emergency-contact-name">
            {pickerData.emergencyContact?.name
              ? `${pickerData.emergencyContact?.name} (${
                  Relationship[pickerData.emergencyContact?.relationship]
                })`
              : "-"}
          </BodyText>
          <BodyText>{pickerData.emergencyContact?.phone}</BodyText>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Label component="label" htmlFor="blood-type">
            {intl.formatMessage({
              id: "pickers.detail.blood_type.label",
              defaultMessage: "Blood Type",
            })}
          </Label>
          <BodyText id="blood-type">
            {pickerData.bloodType ? BloodType[pickerData.bloodType] : "-"}
          </BodyText>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Label component="label" htmlFor="gov-id">
            {intl.formatMessage({
              id: "pickers.detail.identification_number.label",
              defaultMessage: "Identification Number",
            })}
          </Label>

          <BodyText id="gov-id">{pickerData.govId ?? "-"}</BodyText>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Label component="label" htmlFor="address">
            {intl.formatMessage({
              id: "pickers.detail.address.label",
              defaultMessage: "Address",
            })}
          </Label>
          <BodyText id="address">{pickerData.address ?? "-"}</BodyText>
        </Box>

        <Button
          onClick={() => {
            navigate(`${paths.harvestLogs}?pickerId=${pickerId}`)
          }}
        >
          {intl.formatMessage({
            id: "pickers.detail.button.view_harvest_log",
            defaultMessage: "View Harvest Log",
          })}
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Button variant="contained" onClick={showEdit}>
          {intl.formatMessage({
            id: "button.edit",
            defaultMessage: "Edit",
          })}
        </Button>
      </Box>
    </Box>
  )

  return (
    <Drawer
      anchor="right"
      {...props}
      onClose={handleClose}
    >
      {!isLoadingDetail && <>{showEditForm ? pickerForm : pickerDetail}</>}
    </Drawer>
  )
}

export default PickerDrawer;
