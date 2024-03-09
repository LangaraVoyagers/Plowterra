import {
  Alert,
  Box,
  Button,
  Drawer,
  DrawerProps,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { deleteSeason, getSeasonById, upsertSeason } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import useQueryCache from "hooks/useQueryCache";
import { ISeason } from "project-2-types/dist/interface";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
    // getValues,
    formState: { isDirty, errors },
  } = useForm<ISeasonForm>({
    mode: "all",
    defaultValues: {
      name: "",
    },
    // resolver: validateResolver(SeasonSchema), TODO: Validate schema
  });

  //   const seasonData = getValues();

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

  const handleCreateSuccess = (created: ISeason & { _id: string }) => {
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

  const handleUpdateSuccess = (updated: ISeason & { _id: string }) => {
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
    saveSeasonMutation({ ...data, seasonId: seasonId || "" });
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
    >
      <Typography variant="h1">
        {intl.formatMessage(
          {
            id: "pickers.detail.title",
            defaultMessage:
              "{isEdit, plural, one {Edit Picker} other {Add Picker} }",
          },
          { isEdit: Number(!!seasonId) }
        )}
      </Typography>
      <Controller
        control={control}
        name="name"
        render={({ field }) => {
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="picker-name-input">
                {intl.formatMessage({
                  id: "pickers.create.form.name.label",
                  defaultMessage: "Name",
                })}
                *
              </InputLabel>
              <TextField
                {...field}
                id="picker-name-input"
                variant="outlined"
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Box>
          );
        }}
      />

      <Box display="flex" justifyContent="space-between">
        <Button
          disabled={isLoading || isDeleting}
          onClick={seasonId ? hideEdit : onCreateSeasonClose}
        >
          {intl.formatMessage({
            id: "button.cancel",
            defaultMessage: "Cancel",
          })}
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isDirty || isDeleting}
        >
          {intl.formatMessage(
            {
              id: "pickers.button.save",
              defaultMessage:
                "{isLoading, plural, one {Loading...} other {Save} }",
            },
            { isLoading: Number(isLoading) }
          )}
        </Button>
      </Box>

      {/* TODO: add confirmation modal later, we probably will standardize the way we handle the delete after design has defined that */}
      {!!seasonId && (
        <Box display="flex" flexDirection="column" gap={4}>
          <Typography variant="h2">
            {intl.formatMessage({
              id: "danger.zone.label",
              defaultMessage: "Danger Zone",
            })}
          </Typography>
          <Alert
            severity="error"
            variant="outlined"
            action={
              <Button color="error" variant="text" onClick={onDelete}>
                {intl.formatMessage(
                  {
                    id: "pickers.button.delete",
                    defaultMessage:
                      "{isDeleting, plural, one {Deleting...} other {Delete} }",
                  },
                  { isDeleting: Number(isDeleting) }
                )}
              </Button>
            }
            sx={{ display: "flex", alignItems: "center" }}
          >
            {intl.formatMessage({
              id: "pickers.delete.label",
              defaultMessage: "Delete picker data",
            })}
          </Alert>
        </Box>
      )}
    </Box>
  );

  const seasonDetail = (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Button variant="contained" onClick={showEdit}>
          {intl.formatMessage({
            id: "button.edit",
            defaultMessage: "Edit",
          })}
        </Button>
      </Box>
    </Box>
  );

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
