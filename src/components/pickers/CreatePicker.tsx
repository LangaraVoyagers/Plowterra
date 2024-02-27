import { Button } from "@mui/material";
import { useState } from "react";
import PickerDrawer from "./PickerDrawer";

const CreatePicker = () => {
  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" onClick={showDrawer}>
        Add New Picker
      </Button>

      <PickerDrawer open={open} dismiss={hideDrawer} />
    </div>
  );
};

export default CreatePicker;
