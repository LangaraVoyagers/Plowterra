import { OutlinedInput, InputAdornment, debounce } from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useIntl } from "react-intl";

type SearchDataGridProps = {
  applySearch: (text: string) => void;
};

const SearchDataGrid = (props: SearchDataGridProps) => {
  const intl = useIntl();
  const { applySearch } = props;

  return (
    <OutlinedInput
      placeholder={intl.formatMessage({
        id: "search",
        defaultMessage: "Search",
      })}
      size="small"
      onChange={debounce((event) => {
        applySearch(event.target.value)
      }, 500)}
      startAdornment={
        <InputAdornment position="start">
          <MagnifyingGlass />
        </InputAdornment>
      }
    />
  )
};

export default SearchDataGrid;
