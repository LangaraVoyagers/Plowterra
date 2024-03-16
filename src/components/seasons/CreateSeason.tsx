import { Button } from "@mui/material";
import { useState } from "react";
import SeasonDrawer from "./SeasonDrawer";
import { FormattedMessage } from "react-intl";
import { Plant } from "@phosphor-icons/react";
import SuccessDrawer from "./SuccessSeasonDrawer";

const CreateSeason = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAnother, setOpenAnother] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = (success: boolean, button: 'confirm' | 'cancel') => {
    console.log(`Button clicked: ${button}`);
    setOpen(false);
    if (button === 'confirm' && success) {
      setOpenAnother(true);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={showDrawer} endIcon={<Plant />}>
        <FormattedMessage
          id="seasons.create.button.text"
          defaultMessage="Add New Season"
        />
      </Button>

      <SeasonDrawer open={open} dismiss={hideDrawer} />
      <SuccessDrawer open={openAnother} dismiss={() => setOpenAnother(false)} />
    </div>
  );
};

export default CreateSeason;
