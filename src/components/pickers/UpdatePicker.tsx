import { useState } from "react";
import PickerDrawer from "./PickerDrawer";
import ViewMoreButton from "ui/ViewMoreButton";

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
      <ViewMoreButton onClick={showDrawer} />

      {!!open && <PickerDrawer dismiss={hideDrawer} pickerId={pickerId} open />}
    </div>
  );
};

export default UpdatePicker;
