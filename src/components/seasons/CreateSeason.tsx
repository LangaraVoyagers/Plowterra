import { Button } from "@mui/material";
import { useState } from "react";
import SeasonDrawer from "./SeasonDrawer";
import { FormattedMessage } from "react-intl";
import { Plant } from "@phosphor-icons/react";
import SuccessSeasonDrawer from "./SuccessSeasonDrawer";

const CreateSeason = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAnother, setOpenAnother] = useState<boolean>(false);
  const [dataFromSeasonDrawer, setDataFromSeasonDrawer] = useState<any>(null);

  const showDrawer = () => setOpen(true);

  const hideDrawer = (success: boolean, button: 'confirm' | 'cancel', data: any) => {
    setOpen(false);
    if (button === 'confirm' && success) {
      setOpenAnother(true);
      setDataFromSeasonDrawer(data);
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
      <SuccessSeasonDrawer open={openAnother} dismiss={() => setOpenAnother(false)} data={dataFromSeasonDrawer} />
    </div>
  );
};

export default CreateSeason;
