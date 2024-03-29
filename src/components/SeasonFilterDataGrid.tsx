import {
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
} from "@mui/material";
import { getSeasons } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import { useUser } from "context/UserProvider";
import useQueryCache from "hooks/useQueryCache";
import { ISeasonResponse, StatusEnum } from "project-2-types";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "react-query";

type SeasonFilterDataGridProps = {
  onChange: (season?: ISeasonResponse) => void;
  onFetch?: () => void;
  status?: keyof typeof StatusEnum;
  sx?: SxProps<Theme>;
  defaultFirst?: boolean;
  defaultSeasonId?: string;
};

const SeasonFilterDataGrid = (props: SeasonFilterDataGridProps) => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const {
    onChange,
    onFetch,
    status,
    defaultSeasonId,
    defaultFirst = true,
    sx = {},
  } = props;
  const { GET_QUERY_KEY: SEASONS_QUERY_KEY } = useQueryCache("seasons");
  const { defaultSeason: defaultSeasonSaved } = useUser();
  const [seasonsData, setSeasonsData] = useState<Array<ISeasonResponse>>();
  const [selectedSeason, setSelectedSeason] = useState<ISeasonResponse>();

  // Get seasons
  const { isLoading } = useQuery({
    queryKey: [...SEASONS_QUERY_KEY, status],
    queryFn: () => getSeasons({ status }),
    onSuccess: (results) => {
      setSeasonsData(results);
      if (defaultFirst) {
        results?.[0] && setSelectedSeason(results?.[0]);
        results?.[0] && onChange(results?.[0]);
      }

      onFetch?.();
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
      onFetch?.();
    },
  });

  const onSeasonChange = (event: SelectChangeEvent<any>) => {
    const season = seasonsData?.find((s) => s._id === event.target.value);
    setSelectedSeason(season);
    onChange(season);
  };

  useEffect(() => {
    if (defaultSeasonSaved && !selectedSeason?._id && seasonsData?.length) {
      const season = seasonsData.find(
        (season) => season._id === defaultSeasonSaved
      );
      setSelectedSeason(season);
    }
  }, [defaultSeasonSaved]);

  if (!seasonsData?.length || isLoading) {
    return null;
  }

  return (
    <Select
      defaultValue={
        selectedSeason?._id || defaultSeasonId || defaultSeasonSaved
      }
      value={selectedSeason?._id || defaultSeasonId || defaultSeasonSaved}
      size="small"
      sx={{ minWidth: 250, ...sx }}
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
