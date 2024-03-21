import { useIntl } from "react-intl";
import { Label } from "./Typography";

type ViewMoreButtonProps = {
  onClick?: () => void;
};

const ViewMoreButton = ({ onClick }: ViewMoreButtonProps) => {
  const intl = useIntl();

  return (
    <Label onClick={onClick} color="grey-500">
      {intl.formatMessage({
        id: "button.view_more",
        defaultMessage: "View More",
      })}
    </Label>
  );
};

export default ViewMoreButton;
