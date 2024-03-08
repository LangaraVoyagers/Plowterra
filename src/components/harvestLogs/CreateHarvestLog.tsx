import { Button } from "@mui/material";
import { useState } from "react";
import HarvestLogDrawer from "./HarvestLogDrawer";
import { FilePlus } from "@phosphor-icons/react";

const CreateHarvestLog = () => {
  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" onClick={showDrawer} endIcon={<FilePlus />}>
        Add New Log
      </Button>

      <HarvestLogDrawer open={open} dismiss={hideDrawer} />
    </div>
  );
};

export default CreateHarvestLog;
