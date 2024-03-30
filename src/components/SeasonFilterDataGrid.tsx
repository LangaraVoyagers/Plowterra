import { FormattedMessage, useIntl } from "react-intl";
import { ISeasonResponse, StatusEnum } from "project-2-types";
import Select, { StylesConfig } from "react-select";
import {
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";

import { getSeasons } from "api/seasons";
import { uniqueId } from "lodash";
import { useAlert } from "context/AlertProvider";
import { useQuery } from "react-query";
import useQueryCache from "hooks/useQueryCache";
import { useThemMode } from "context/ThemeProvider";
import { useUser } from "context/UserProvider";

type SeasonFilterDataGridProps = {
  onChange: (season?: ISeasonResponse) => void;
  onFetch?: () => void;
  getDefaultSeasonId?: (seasonId?: string) => void;
  status?: keyof typeof StatusEnum;
  sx?: any;
  defaultFirst?: boolean;
  latestFirst?:boolean;
  defaultSeasonId?: string;
};

const SeasonFilterDataGrid = (props: SeasonFilterDataGridProps) => {
  const theme = useTheme();
  const { mode } = useThemMode();
  const intl = useIntl();
  const { showAlert } = useAlert();
  const {
    onChange,
    onFetch,
    getDefaultSeasonId,
    status,
    defaultSeasonId,
    defaultFirst=true,
    latestFirst=true,
    sx = {},
  } = props;
  const { GET_QUERY_KEY: SEASONS_QUERY_KEY } = useQueryCache("seasons");
  const { defaultSeason: defaultSeasonSaved } = useUser();
  const [seasonsData, setSeasonsData] = useState<Array<ISeasonResponse>>();
  const [selectedSeason, setSelectedSeason] = useState<ISeasonResponse| any>();
  const [refresh, setRefresh] = useState<string>();
  const midScreen = useMediaQuery(theme.breakpoints.up('md'));

  const reactSelectStyles: StylesConfig = {
    control: (base, state) => ({
      ...base,
      height: 30,
      width: midScreen ? 240 : "100%",
      outline: `1px solid ${ theme.palette.grey[200] }`,
      ":hover": {
        border: state.isFocused ? `2px solid ${ theme.palette.primary.dark }` : `1px solid ${ theme.palette.grey[900] }`
      },
      border: state.isFocused ? `2px solid ${ theme.palette.primary.dark }` : "none",
      borderRadius: "0.5rem",
      boxShadow: state?.isFocused ? `0px 0px 0px 1px ${ theme.palette.primary.light }, 0px 0px 0px 3px ${ theme.palette.primary.light }` : "none",
      ...sx?.control
    }),
    singleValue: base => ({
      ...base,
      color: mode === "light" ? "black" : "white",
      ...sx?.singleValue
    }),
    option: base => ({
      ...base,
      ...sx?.option
    }),
    menu: base => ({
      ...base,
      width: midScreen ? 240 : "100%",
      borderRadius: "0.5rem",
      ...sx?.menu
    }),
    menuList: base =>({
      ...base,
      "::-webkit-scrollbar": {
        width: "0px",
        height: "0px",
      },
      ...sx?.menuList
    }),
    indicatorSeparator: () => ({
      display:'none',
      ...sx?.indicatorSeparator
    }),
  };

  // Get seasons
  const { isLoading } = useQuery({
    queryKey: [...SEASONS_QUERY_KEY, status],
    queryFn: () => getSeasons({ status }),
    onSuccess: (results) => {
      if (latestFirst) results?.reverse();
      setSeasonsData(results);
      setRefresh(uniqueId())
      getDefaultSeasonId?.(defaultSeasonSaved);
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

  const onSeasonChange = (e: any) => {
    const season = seasonsData?.find(season => season._id === e?.value);
    setSelectedSeason(season);
    onChange(season);
  }

  useMemo(() => {
    if (defaultFirst || (!defaultSeasonId && !defaultSeasonSaved)) {
      seasonsData?.[0] && setSelectedSeason(seasonsData?.[0])
      seasonsData?.[0] &&onChange(seasonsData?.[0]);
    } else {
      const season = seasonsData?.find(season => season._id === (defaultSeasonId ? defaultSeasonId : defaultSeasonSaved))
      season && setSelectedSeason(season);
      season && onChange(season);
    }
  }, [refresh]);

  return (
    <Select
      isLoading={isLoading}
      placeholder={<FormattedMessage defaultMessage="Select Season" id="select.season"/>}
      value={{label: selectedSeason?.name, value: selectedSeason?._id}}
      styles={reactSelectStyles}
      theme={(base) => ({
        ...base,
        colors: {
          ...base.colors,
          neutral0: theme.palette.background.paper,
          neutral80: mode === "light" ? "#000" : "#FFF",
          primary25: theme.palette.primary.light,
          primary50: theme.palette.primary.light,
          primary75: theme.palette.primary.main,
          primary: theme.palette.primary.main,
        }
      })}
      onChange={onSeasonChange}
      options={seasonsData?.map((season) => {
        return {
          label: season.name,
          value: season._id
        }
      })}
      noOptionsMessage={() => "Season not found"}
    />
  );
};

export default SeasonFilterDataGrid;
