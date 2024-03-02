import { Button } from "@mui/material";
import { useState } from "react";
import HarvestLogDrawer from "./HarvestLogDrawer";
// import { useIntl } from "react-intl";

type UpdateHarvestLogProps = {
  harvestLogId: string;
};
const UpdateHarvestLog = (props: UpdateHarvestLogProps) => {
  const { harvestLogId } = props;
  // const intl = useIntl();

  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  //TODO: add translation
  return (
    <div>
      <Button onClick={showDrawer}>View More</Button>

      {!!open && (
        <HarvestLogDrawer
          dismiss={hideDrawer}
          harvestLogId={harvestLogId}
          open
        />
      )}
    </div>
  );
};

export default UpdateHarvestLog;
