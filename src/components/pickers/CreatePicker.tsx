import { Button } from "@mui/material";
import { useState } from "react";
import PickerDrawer from "./PickerDrawer";
import { FormattedMessage } from "react-intl";

const CreatePicker = () => {
  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" onClick={showDrawer}>
        <FormattedMessage
          id="pickers.create.button.text"
          defaultMessage="Add New Picker"
        />
      </Button>

      <PickerDrawer open={open} dismiss={hideDrawer} />
    </div>
  );
};

export default CreatePicker;
