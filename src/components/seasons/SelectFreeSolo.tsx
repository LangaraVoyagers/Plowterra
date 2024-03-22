import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { SxProps, Theme } from "@mui/material";

interface IValue {
  inputValue?: string;
  label: string;
  id?: string;
}

const filter = createFilterOptions<IValue>();

type SelectFreeSoloProps = {
  id: string;
  options: Array<IValue>;
  defaultValue: IValue;
  onChange?: (value: IValue) => void;
  onCreate?: (value: string) => Promise<string>;
  sx?: SxProps<Theme>;
};

export default function SelectFreeSolo({
  id,
  options,
  defaultValue,
  onCreate,
  onChange,
  sx,
}: SelectFreeSoloProps) {
  const [value, setValue] = React.useState<IValue | null>(defaultValue ?? null);

  return (
    <Autocomplete
      id={id}
      options={options}
      value={value}
      onChange={async (_, newValue) => {
        if (typeof newValue !== "object" || !newValue) {
          return;
        }
        if (newValue.inputValue) {
          if (newValue.id === "new") {
            if (onCreate) {
              const newId = await onCreate(newValue.inputValue);

              setValue({
                id: newId,
                label: newValue.inputValue,
              });
            } else {
              setValue({
                id: newValue.id,
                label: newValue.inputValue,
              });
            }
          }
        } else {
          setValue({
            id: newValue.id,
            label: newValue.label,
          });
          onChange?.({
            id: newValue.id,
            label: newValue.label,
          });
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.label
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            label: `Add "${inputValue}"`,
            id: "new",
          });
        }

        return filtered;
      }}
      selectOnFocus
      handleHomeEndKeys
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      sx={{ width: 200, ...sx }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} size="small" variant="outlined" />
      )}
    />
  );
}
