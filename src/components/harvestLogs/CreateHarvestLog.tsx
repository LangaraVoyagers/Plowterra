import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import HarvestLogDrawer from "./HarvestLogDrawer";
import { FilePlus } from "@phosphor-icons/react";
import { useSearchParams } from "react-router-dom";

const CreateHarvestLog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const openNew = searchParams.get("new");

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  useEffect(() => {
    if (openNew === "true") {
      showDrawer();
    }
  }, [openNew]);

  return (
    <div>
      <Button variant="contained" onClick={showDrawer} endIcon={<FilePlus />}>
        Add Entry
      </Button>

      <HarvestLogDrawer open={open} dismiss={hideDrawer} />
    </div>
  )
};

export default CreateHarvestLog;
