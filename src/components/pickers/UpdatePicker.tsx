import { Button } from "@mui/material";
import { useState } from "react";
import PickerDrawer from "./PickerDrawer";
import { useIntl } from "react-intl";

type UpdatePickerProps = {
  pickerId: string;
};
const UpdatePicker = (props: UpdatePickerProps) => {
  const { pickerId } = props;
  const intl = useIntl();

  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);

  const hideDrawer = () => setOpen(false);

  return (
    <div>
      <Button onClick={showDrawer}>
        {intl.formatMessage({
          id: "pickers.table.button.view_more",
          defaultMessage: "View More",
        })}
      </Button>

      {!!open && <PickerDrawer dismiss={hideDrawer} pickerId={pickerId} open />}
    </div>
  );
};

export default UpdatePicker;
