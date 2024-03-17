import { Button } from "@mui/material";
import { useState } from "react";
import PickerDrawer from "./PickerDrawer";
import { FormattedMessage } from "react-intl";
import { UserPlus } from "@phosphor-icons/react";
import SuccessPickerDrawer from "./SuccessPickerDrawer.tsx";

const CreatePicker = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAnother, setOpenAnother] = useState<boolean>(false);
  const [dataFromPickerDrawer, setDataFromPickerDrawer] = useState<any>(null);

  const showDrawer = () => setOpen(true);

  const hideDrawer = (success: boolean, button: 'confirm' | 'cancel', data: any) => {
    setOpen(false);
    if (button === 'confirm' && success) {
      setOpenAnother(true);
      setDataFromPickerDrawer(data);
    }
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
      <SuccessPickerDrawer open={openAnother} dismiss={() => setOpenAnother(false)} data={dataFromPickerDrawer} />
    </div>
  );
};

export default CreatePicker;
