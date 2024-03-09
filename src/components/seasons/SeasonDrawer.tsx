import { Box, Drawer, DrawerProps } from "@mui/material";
import { deleteSeason, getSeasonById, upsertSeason } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import useQueryCache from "hooks/useQueryCache";
import { ISeason } from "project-2-types/dist/interface";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "react-query";

interface ISeasonForm extends Omit<ISeason, "id"> {}

type SeasonDrawerProps = DrawerProps & {
  seasonId?: string;
  dismiss: () => void;
};

const SeasonDrawer = ({ dismiss, seasonId, ...props }: SeasonDrawerProps) => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const {
    GET_DETAIL_QUERY_KEY,
    UPDATE_MUTATION_KEY,
    CREATE_MUTATION_KEY,
    createCache,
    updateCache,
    deleteCache,
  } = useQueryCache("seasons", seasonId);

  const [showEditForm, setShowEditForm] = useState<boolean>(!seasonId);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, errors },
  } = useForm<ISeasonForm>({
    mode: "all",
    defaultValues: {
      name: "",
    },
    // resolver: validateResolver(SeasonSchema), TODO: Validate schema
  });

  const seasonData = getValues();

  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: GET_DETAIL_QUERY_KEY,
    queryFn: () => getSeasonById(seasonId),
    enabled: !!seasonId,
    onSuccess: (result) => {
      reset(result);
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "season.detail.error",
          defaultMessage: "Oops! Information couldn't be displayed.",
        }),
        "error"
      );
    },
  });

  const { mutate: saveSeasonMutation, isLoading } = useMutation({
    mutationKey: seasonId ? UPDATE_MUTATION_KEY : CREATE_MUTATION_KEY,
    mutationFn: upsertSeason,
    onSuccess: (result) => {
      if (seasonId) {
        handleUpdateSuccess(result);
      } else {
        handleCreateSuccess(result);
      }
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "seasons.create.season.response.error",
          defaultMessage: "Oops! The season couldn't be saved.",
        }),
        "error"
      );
    },
  });

  const onCreateSeasonClose = () => {
    reset();
    dismiss();
  };

  const handleCreateSuccess = (created: ISeason) => {
    createCache(created);
    showAlert(
      intl.formatMessage({
        id: "seasons.create.season.response.success",
        defaultMessage: "The season was created successfully",
      }),
      "success"
    );
    onCreateSeasonClose();
  };

  const handleUpdateSuccess = (updated: ISeason) => {
    updateCache(updated);
    showAlert(
      intl.formatMessage({
        id: "seasons.update.season.response.success",
        defaultMessage: "The season was updated successfully",
      }),
      "success"
    );
    hideEdit();
  };

  const showEdit = () => setShowEditForm(true);
  const hideEdit = () => setShowEditForm(false);

  const { mutate: deleteSeasonMutation, isLoading: isDeleting } = useMutation({
    mutationKey: ["pickers", "delete", seasonId],
    mutationFn: deleteSeason,
    onSuccess: (result) => {
      deleteCache(result);
      showAlert(
        intl.formatMessage({
          id: "seasons.delete.season.response.success",
          defaultMessage: "The season was deleted successfully.",
        }),
        "success"
      );
      dismiss();
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "seasons.delete.season.response.error",
          defaultMessage: "Oops! The season couldn't be deleted.",
        }),
        "error"
      );
    },
  });

  const onSubmit = (data: ISeasonForm) => {
    saveSeasonMutation({ ...data, seasonId });
  };

  const onDelete = () => {
    deleteSeasonMutation(seasonId);
  };

  const seasonForm = (
    <Box
      display="flex"
      flexDirection="column"
      padding="3rem"
      gap={3}
      width={600}
    ></Box>
  );

  const seasonDetail = <Box></Box>;

  return (
    <Drawer
      anchor="right"
      {...props}
      onClose={!showEditForm ? dismiss : undefined}
    >
      {!isLoadingDetail && <>{showEditForm ? seasonForm : seasonDetail}</>}
    </Drawer>
  );
};

export default SeasonDrawer;
