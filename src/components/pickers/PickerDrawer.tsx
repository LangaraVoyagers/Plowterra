import {
  Box,
  Button,
  Drawer,
  DrawerProps,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { upsertPicker, getPickerById } from "api/pickers";
import { useAlert } from "context/AlertProvider";
import { BloodType, IPicker, Relationship } from "project-2-types/lib/pickers";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IPickerForm>();

  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: ["pickers", "detail", pickerId],
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
    mutationKey: ["pickers", pickerId ? "update" : "create", pickerId],
    mutationFn: upsertPicker,
    onSuccess: (result) => {
      queryClient.setQueryData<Array<IPicker>>(["pickers", "get"], (prev) => {
        if (pickerId) {
          return (prev ?? []).map((data) => {
            if (data.id === result.id) {
              return result;
            }

            return data;
          });
        }
        return [result, ...(prev ?? [])];
      });
      showAlert(
        `The picker was ${pickerId ? "updated" : "created"} successfully`
      );
      reset();
      dismiss();
    },
  });

  const onSubmit = (data: IPickerForm) => {
    savePickerMutation({ ...data, pickerId });
  };

  return (
    <Drawer anchor="right" {...props}>
      {!isLoadingDetail && (
        <Box
          display="flex"
          flexDirection="column"
          padding="3rem"
          gap={3}
          width={600}
        >
          <Typography variant="h1">
            {pickerId ? "Edit Picker" : "Add Picker"}
          </Typography>
          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              return (
                <Box display="flex" flexDirection="column" gap={1}>
                  <InputLabel htmlFor="picker-name-input">Name*</InputLabel>
                  <OutlinedInput
                    {...field}
                    id="picker-name-input"
                    size="small"
                  />
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
                    Phone Number*
                  </InputLabel>

                  <OutlinedInput
                    {...field}
                    id="picker-phone-input"
                    size="small"
                  />
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
                    Emergency Contact Name*
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
                    Relation to picker*
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
                    Emergency Contact Number*
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
                    Blood Type
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
                    Identification Number
                  </InputLabel>

                  <OutlinedInput
                    {...field}
                    id="picker-gov-id-input"
                    size="small"
                  />
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
                    Address
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
            <Button disabled={isLoading} onClick={dismiss}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || !isDirty}
            >
              {isLoading ? "Loading..." : "Save"}
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default PickerDrawer;
