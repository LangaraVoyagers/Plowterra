import { Box, Button, Grid, IconButton, TextField } from "@mui/material";
import { Minus, Plus } from "@phosphor-icons/react";
import { createDeduction, getDeductions } from "api/deductions";
import useQueryCache from "hooks/useQueryCache";

import { useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { ISeasonRequest } from "./SeasonDrawer";
import SelectFreeSolo from "./SelectFreeSolo";
import { useIntl } from 'react-intl';


const SeasonDeductions = () => {
  const { control, setValue } = useFormContext<ISeasonRequest>();
  const { fields, remove, append } = useFieldArray({
    control,
    name: "deductions",
  });

  const {
    GET_DETAIL_QUERY_KEY: GET_DEDUCTIONS_KEY,
    CREATE_MUTATION_KEY: CREATE_DEDUCTION_KEY,
    createCache,
  } = useQueryCache("deductions");

  const [deductions, setDeductions] = useState<
    Array<{ _id: string; name: string }>
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get all deductions
  useQuery({
    queryKey: GET_DEDUCTIONS_KEY,
    queryFn: getDeductions,
    onSuccess: (result) => {
      setDeductions(result);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
    },
  });

  const { mutateAsync: createDeductionMutation } = useMutation({
    mutationKey: CREATE_DEDUCTION_KEY,
    mutationFn: createDeduction,
  });

  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="column" width="100%" gap={2}>
      {!isLoading &&
        fields.map((field, index) => {
          return (
            <Grid id={field.id} key={field.id} container spacing={4}>
              <Grid key={`${index}-left`} item width="45%">
                <SelectFreeSolo
                  options={deductions.map((d) => ({
                    id: d._id,
                    label: d.name,
                  }))}
                  defaultValue={{
                    id: field.deductionID,
                    label:
                      deductions.find((d) => d._id === field.deductionID)
                        ?.name ?? "",
                  }}
                  onCreate={async (value) => {
                    try {
                      const data = await createDeductionMutation(value);
                      setValue(`deductions.${index}.deductionID`, data?._id);
                      createCache(data);

                      return data?._id;
                    } catch (error) {
                      return "";
                    }
                  }}
                  onChange={({ id }) => {
                    id && setValue(`deductions.${index}.deductionID`, id);
                  }}
                  id="select-deduction-input"
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid
                key={`${index}-right`}
                item
                display="flex"
                width="55%"
                gap={3}
              >
                <Controller
                  name={`deductions.${index}.price`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        {...field}
                        type="number"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    );
                  }}
                />

                <IconButton onClick={() => remove(index)}>
                  <Minus />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
      <Box display="flex" justifyContent="end">
        <Button
          variant="text"
          size="small"
          endIcon={<Plus />}
          onClick={() => {
            append({ deductionID: "", price: "" });
          }}
        >
          {/* Add Deduction */}
          {intl.formatMessage({ id: "seasonDeduction.add", defaultMessage: "Add Deduction" })}
        </Button>
      </Box>
    </Box>
  );
};

export default SeasonDeductions;
