import { Button } from "@mui/material";
import { useState } from "react";
import PickerDrawer from "./PickerDrawer";

type UpdatePickerProps = {
  pickerId: string;
};
const UpdatePicker = (props: UpdatePickerProps) => {
  const { pickerId } = props;

  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  return (
    <div>
      <Button onClick={showDrawer}>View More</Button>

      {!!open && <PickerDrawer dismiss={hideDrawer} pickerId={pickerId} open />}
    </div>
  );
};

export default UpdatePicker;
