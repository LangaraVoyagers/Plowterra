import { OutlinedInput, InputAdornment, debounce } from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useIntl } from "react-intl";

type SearchDataGridProps = {
  applySearch: (text: string) => void;
  searchValue?: string;
};

const SearchDataGrid = (props: SearchDataGridProps) => {
  const intl = useIntl();
  const { applySearch, searchValue } = props;

  return (
    <OutlinedInput
      placeholder={intl.formatMessage({
        id: "search",
        defaultMessage: "Search",
      })}
      defaultValue={searchValue}
      size="small"
      sx={{ width: "24rem" }}
      onChange={debounce((event) => {
        applySearch(event.target.value);
      }, 500)}
      startAdornment={
        <InputAdornment position="start">
          <MagnifyingGlass />
        </InputAdornment>
      }
    />
  );
};

export default SearchDataGrid;
