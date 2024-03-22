import { useState } from "react";
import HarvestLogDrawer from "./HarvestLogDrawer";
import ViewMoreButton from "ui/ViewMoreButton";

type UpdateHarvestLogProps = {
  harvestLogId: string;
};
const UpdateHarvestLog = (props: UpdateHarvestLogProps) => {
  const { harvestLogId } = props;

  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  return (
    <div>
      <ViewMoreButton onClick={showDrawer} />
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
