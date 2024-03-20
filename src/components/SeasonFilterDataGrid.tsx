import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { getSeasons } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import useQueryCache from "hooks/useQueryCache";
import { ISeasonResponse } from "project-2-types";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "react-query";

type SeasonFilterDataGridProps = {
  onChange: (season?: ISeasonResponse) => void;
  onFetch: () => void;
};

const SeasonFilterDataGrid = (props: SeasonFilterDataGridProps) => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const { onChange, onFetch } = props;
  const { GET_QUERY_KEY: SEASONS_QUERY_KEY } = useQueryCache("seasons");

  const [seasonsData, setSeasonsData] = useState<Array<ISeasonResponse>>();
  const [selectedSeason, setSelectedSeason] = useState<ISeasonResponse>();

  // Get seasons
  useQuery({
    queryKey: SEASONS_QUERY_KEY,
    queryFn: getSeasons,
    onSuccess: (results) => {
      setSeasonsData(results);
      setSelectedSeason(results?.[0]);
      onChange(results?.[0]);
      onFetch();
    },
    onError: (error) => {
      console.error({ error });
      showAlert(
        intl.formatMessage({
          id: "season.filter.data.grid.get.seasons.error",
          defaultMessage: "No seasons found",
        }),
        "error"
      );
      onFetch();
    },
  });
  const onSeasonChange = (event: SelectChangeEvent<any>) => {
    const season = seasonsData?.find((s) => s._id === event.target.value);
    setSelectedSeason(season);
    onChange(season);
  };

  return (
    <Select
      defaultValue={selectedSeason?._id}
      value={selectedSeason?._id}
      size="small"
      sx={{ minWidth: 250 }}
      onChange={onSeasonChange}
    >
      {seasonsData?.map((season) => (
        <MenuItem key={season._id} value={season._id}>
          {season.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SeasonFilterDataGrid;
