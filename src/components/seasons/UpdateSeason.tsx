import { useState } from "react";
import SeasonDrawer from "./SeasonDrawer";
import ViewMoreButton from "ui/ViewMoreButton";

type UpdateSeasonProps = {
  seasonId: string;
};

const UpdateSeason = (props: UpdateSeasonProps) => {
  const { seasonId } = props;

  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  return (
    <div>
      <ViewMoreButton onClick={showDrawer} />

      {!!open && <SeasonDrawer dismiss={hideDrawer} seasonId={seasonId} open />}
    </div>
  );
};

export default UpdateSeason;
