import { Select, MenuItem } from "@mui/material";
import { useIntl } from "react-intl";

type FilterItem = {
  field: string;
  operator: string;
  value: string;
};

type FilterDataGridProps = {
  filterModel: FilterItem;
  setFilterModel: (model: FilterItem[]) => void;
  options: Array<FilterItem & { label: string }>;
};

const filterDataGrid = (props: FilterDataGridProps) => {
  const intl = useIntl();
  const { options, filterModel, setFilterModel } = props;

  return (
    <Select
      labelId="filterby-label"
      id="filterby-select"
      defaultValue={
        filterModel
          ? `${filterModel.field}--${filterModel.operator}--${filterModel.value}`
          : undefined
      }
      size="medium"
      onChange={({ target: { value } }) => {
        try {
          const data = value?.split("--") ?? []
          if (data.length) {
            const [field, operator, value] = data

            setFilterModel([{ field, operator, value }])
          }
        } catch (error) {
          intl.formatMessage({
            id: "seasons.filtering.error",
            defaultMessage: "Fail to apply filtering.",
          })
        }
      }}
      sx={{ minWidth: 150 }}
    >
      {options.map(({ field, operator, value, label }, index) => (
        <MenuItem key={index} value={`${field}--${operator}--${value}`}>
          {label}
        </MenuItem>
      ))}
    </Select>
  )
};

export default filterDataGrid;
