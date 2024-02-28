import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { upsertPicker, getPickerById, deletePicker } from "api/pickers";
import useQueryCache from "hooks/useQueryCache";
import { useAlert } from "context/AlertProvider";
import { BloodType, IPicker, Relationship } from "project-2-types/lib/pickers";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useIntl } from "react-intl";

interface IPickerForm extends Omit<IPicker, "id"> {}

const relationshipList = (
  Object.keys(Relationship) as Array<keyof typeof Relationship>
).map((key) => ({ value: key, label: Relationship[key] }));

const bloodTypeList = (
  Object.keys(BloodType) as Array<keyof typeof BloodType>
).map((key) => ({ value: key, label: BloodType[key] }));

type PickerDrawerProps = DrawerProps & {
  pickerId?: string;
  dismiss: () => void;
};
const PickerDrawer = ({ dismiss, pickerId, ...props }: PickerDrawerProps) => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const {
    GET_DETAIL_QUERY_KEY,
    UPDATE_MUTATION_KEY,
    CREATE_MUTATION_KEY,
    createCache,
    updateCache,
    deleteCache,
  } = useQueryCache("pickers", pickerId);

  const [showEditForm, setShowEditForm] = useState<boolean>(!pickerId);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = useForm<IPickerForm>();

  const pickerData = getValues();

  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: GET_DETAIL_QUERY_KEY,
    queryFn: () => getPickerById(pickerId),
    enabled: !!pickerId,
    onSuccess: (result) => {
      reset(result);
    },
    onError: () => {
      showAlert("Oops! Information couldn't be displayed.");
    },
  });

  const { mutate: savePickerMutation, isLoading } = useMutation({
    mutationKey: pickerId ? UPDATE_MUTATION_KEY : CREATE_MUTATION_KEY,
    mutationFn: upsertPicker,
    onSuccess: (result) => {
      if (pickerId) {
        handleUpdateSuccess(result);
      } else {
        handleCreateSuccess(result);
      }
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "pickers.create.picker.response.error",
          defaultMessage: "Oops! The picker couldn't be saved.",
        })
      );
    },
  });

  const onCreatePickerClose = () => {
    reset();
    dismiss();
  };

  const handleCreateSuccess = (created: IPicker) => {
    createCache(created);
    showAlert(`The picker was created successfully`);
    onCreatePickerClose();
  };

  const handleUpdateSuccess = (updated: IPicker) => {
    updateCache(updated);
    showAlert(`The picker was updated successfully`);
    hideEdit();
  };

  const { mutate: deletePickerMutation, isLoading: isDeleting } = useMutation({
    mutationKey: ["pickers", "delete", pickerId],
    mutationFn: deletePicker,
    onSuccess: (result) => {
      deleteCache(result);
      showAlert(
        intl.formatMessage({
          id: "pickers.delete.picker.response.success",
          defaultMessage: "The picker was deleted successfully.",
        })
      );
      dismiss();
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "pickers.delete.picker.response.error",
          defaultMessage: "Oops! The picker couldn't be deleted.",
        })
      );
    },
  });

  const onSubmit = (data: IPickerForm) => {
    savePickerMutation({ ...data, pickerId });
  };

  const onDelete = () => {
    deletePickerMutation(pickerId);
  };

  const showEdit = () => setShowEditForm(true);
  const hideEdit = () => setShowEditForm(false);

  const pickerForm = (
    <Box
      display="flex"
      flexDirection="column"
      padding="3rem"
      gap={3}
      width={600}
    >
      <Typography variant="h1">
        {intl.formatMessage(
          {
            id: "pickers.detail.title",
            defaultMessage:
              "{isEdit, plural, one {Edit Picker} other {Add Picker} }",
          },
          { isEdit: Number(!!pickerId) }
        )}
      </Typography>
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
              <OutlinedInput {...field} id="picker-name-input" size="small" />
            </Box>
          );
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

              <OutlinedInput {...field} id="picker-phone-input" size="small" />
            </Box>
          );
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

              <OutlinedInput
                {...field}
                id="picker-contact-name-input"
                size="small"
              />
            </Box>
          );
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

              <Select {...field} id="picker-relation-input" size="small">
                {relationshipList?.map(({ value, label }) => {
                  return (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          );
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

              <FormGroup row>
                <Select defaultValue={1} size="small">
                  {/* Get the countries list */}
                  <MenuItem value={1}>COL</MenuItem>
                </Select>
                <OutlinedInput
                  {...field}
                  id="picker-contact-number-input"
                  size="small"
                  sx={{ flex: 1 }}
                />
              </FormGroup>
            </Box>
          );
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

              <Select {...field} id="picker-blood-type-input" size="small">
                {bloodTypeList?.map(({ value, label }) => {
                  return (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          );
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

              <OutlinedInput {...field} id="picker-gov-id-input" size="small" />
            </Box>
          );
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

              <OutlinedInput
                {...field}
                id="picker-address-input"
                multiline
                rows={2}
              />
            </Box>
          );
        }}
      />

      <Box display="flex" justifyContent="space-between">
        <Button
          disabled={isLoading || isDeleting}
          onClick={pickerId ? hideEdit : onCreatePickerClose}
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
      {!!pickerId && (
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
                    id: "pickers.button.save",
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
              id: "pickers.button.delete",
              defaultMessage: "Delete picker data",
            })}
          </Alert>
        </Box>
      )}
    </Box>
  );

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
          <Typography variant="h1">{pickerData.name}</Typography>
          <Typography variant="body1">{pickerData.phone}</Typography>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Typography variant="overline">Emergency Contact Person</Typography>
          <Typography variant="body1" fontWeight={600}>
            {pickerData.emergencyContact?.name
              ? `${pickerData.emergencyContact?.name} (${
                  Relationship[pickerData.emergencyContact?.relationship]
                })`
              : "-"}
          </Typography>
          <Typography variant="body1">
            {pickerData.emergencyContact?.phone}
          </Typography>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Typography variant="overline">Blood Type</Typography>
          <Typography variant="body1">
            {pickerData.bloodType ? BloodType[pickerData.bloodType] : "-"}
          </Typography>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Typography variant="overline">Identification Number</Typography>
          <Typography variant="body1">{pickerData.govId ?? "-"}</Typography>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Typography variant="overline">Address</Typography>
          <Typography variant="body1">{pickerData.address ?? "-"}</Typography>
        </Box>

        <Button
          onClick={() =>
            showAlert(
              "🚧 Thank you for your patience. We are still working on this part 🚧"
            )
          }
        >
          View Harvest Log
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Button variant="contained" onClick={showEdit}>
          Edit
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
      {!isLoadingDetail && <>{showEditForm ? pickerForm : pickerDetail}</>}
    </Drawer>
  );
};

export default PickerDrawer;
