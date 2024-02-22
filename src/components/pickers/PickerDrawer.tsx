import {
  Box,
  Button,
  Drawer,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { BloodType, IPicker } from "project-2-types/lib/pickers";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface IPickerForm extends Omit<IPicker, "id"> {}

const PickerDrawer = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<IPickerForm>();

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  const onSubmit = (data: IPickerForm) => {
    console.log({ data });
  };

  return (
    <div>
      <Button variant="contained" onClick={showDrawer}>
        Add New Picker
      </Button>
      <Drawer anchor="right" open={open} onClose={hideDrawer}>
        <Box
          display="flex"
          flexDirection="column"
          padding="3rem"
          gap={3}
          width={600}
        >
          <Typography variant="h1">Add Picker</Typography>
          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              return (
                <Box display="flex" flexDirection="column" gap={1}>
                  <InputLabel htmlFor="picker-name-input">Name*</InputLabel>
                  <OutlinedInput {...field} id="picker-name-input" />
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

                  <OutlinedInput {...field} id="picker-phone-input" />
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
                  <FormGroup row>
                    <Select defaultValue={1}>
                      {/* Get the countries list */}
                      <MenuItem value={1}>COL</MenuItem>
                    </Select>
                    <OutlinedInput {...field} id="picker-contact-name-input" />
                  </FormGroup>
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

                  <OutlinedInput {...field} id="picker-relation-input" />
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
                    <Select defaultValue={1}>
                      {/* Get the countries list */}
                      <MenuItem value={1}>COL</MenuItem>
                    </Select>
                    <OutlinedInput {...field} id="picker-contact-name-input" />
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

                  <Select {...field} id="picker-blood-type-input">
                    {/* Get the blood type list */}
                    <MenuItem value={BloodType.AB_POSITIVE}>A+</MenuItem>
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

                  <OutlinedInput {...field} id="picker-gov-id-input" />
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
                    rows={3}
                  />
                </Box>
              );
            }}
          />

          <Box display="flex" justifyContent="space-between">
            <Button>Cancel</Button>

            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default PickerDrawer;
