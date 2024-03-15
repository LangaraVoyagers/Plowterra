import { Button } from "@mui/material";
import { useState } from "react";
import PickerDrawer from "./PickerDrawer";
import SuccessDrawer from "./SuccessPickerDrawer.tsx";
import { FormattedMessage } from "react-intl";
import { UserPlus } from "@phosphor-icons/react";

const CreatePicker = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAnother, setOpenAnother] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => {
    setOpen(false);
    setOpenAnother(true);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={showDrawer}
        endIcon={<UserPlus size={20} />}
      >
        <FormattedMessage
          id="pickers.create.button.text"
          defaultMessage="Add New Picker"
        />
      </Button>

      <PickerDrawer open={open} dismiss={hideDrawer} />
      <SuccessDrawer open={openAnother} dismiss={() => setOpenAnother(false)} />
    </div>
  );
};

export default CreatePicker;
