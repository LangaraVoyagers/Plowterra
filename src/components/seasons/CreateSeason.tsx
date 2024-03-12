import { Button } from "@mui/material";
import { useState } from "react";
import SeasonDrawer from "./SeasonDrawer";
import { FormattedMessage } from "react-intl";
import { Plant } from "@phosphor-icons/react";

const CreateSeason = () => {
  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" onClick={showDrawer} endIcon={<Plant />}>
        <FormattedMessage
          id="seasons.create.button.text"
          defaultMessage="Add New Season"
        />
      </Button>

      <SeasonDrawer open={open} dismiss={hideDrawer} />
    </div>
  );
};

export default CreateSeason;
