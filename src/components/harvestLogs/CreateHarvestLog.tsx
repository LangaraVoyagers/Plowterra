import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@mui/material";
import { FilePlus } from "@phosphor-icons/react";
import HarvestLogDrawer from "./HarvestLogDrawer";
import paths from "shared/paths";

const CreateHarvestLog = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const openNew = searchParams.get("new");

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => {
    setOpen(false);
    navigate(paths.harvestLogs);
  }

  useEffect(() => {
    if (openNew === "true") {
      showDrawer();
    }
  }, [openNew]);

  return (
    <div>
      <Button variant="contained" onClick={showDrawer} endIcon={<FilePlus />}>
        Add Harvest Entry
      </Button>

      <HarvestLogDrawer open={open} dismiss={hideDrawer} />
    </div>
  )
};

export default CreateHarvestLog;
