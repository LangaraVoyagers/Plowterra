import { Button } from "@mui/material";
import { useState } from "react";
import PickerDrawer from "./PickerDrawer";
import SuccessDrawer from "./SuccessDrawer.tsx"; // Importa el componente del nuevo Drawer aquí
import { FormattedMessage } from "react-intl";
import { UserPlus } from "@phosphor-icons/react";

const CreatePicker = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAnother, setOpenAnother] = useState<boolean>(false); // Estado para el nuevo Drawer

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => {
    setOpen(false); // Cierra el Drawer existente
    setOpenAnother(true); // Abre el nuevo Drawer
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
      <SuccessDrawer open={openAnother} dismiss={() => setOpenAnother(false)} /> {/* Renderiza el nuevo Drawer */}
    </div>
  );
};

export default CreatePicker;
