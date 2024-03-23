import { Select, MenuItem } from "@mui/material";
import { useIntl } from "react-intl";

type SortItem = { field: string; sort: string };

type SortDataGridProps = {
  sortModel: SortItem;
  setSortModel: (model: SortItem[]) => void;
  options: Array<SortItem & { label: string }>;
};

const SortDataGrid = (props: SortDataGridProps) => {
  const intl = useIntl();
  const { options, sortModel, setSortModel } = props;

  return (
    <Select
      labelId="sortby-label"
      id="sortby-select"
      defaultValue={
        sortModel ? `${sortModel.field}--${sortModel.sort}` : undefined
      }
      size="small"
      onChange={({ target: { value } }) => {
        try {
          const data = value?.split("--") ?? [];
          if (data.length) {
            const [field, sort] = data;

            setSortModel([{ field, sort }]);
          }
        } catch (error) {
          intl.formatMessage({
            id: "pickers.sorting.error",
            defaultMessage: "Fail to apply sorting.",
          });
        }
      }}
      sx={{ minWidth: 150, height: 44 }}
    >
      {options.map(({ field, sort, label }, index) => (
        <MenuItem key={index} value={`${field}--${sort}`}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SortDataGrid;
