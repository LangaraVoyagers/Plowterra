import { styled } from "@mui/material";
import { BodyText } from "./Typography";

type InputLabelProps = {
  htmlFor: string;
  required?: boolean;
  children?: React.ReactNode;
};
const InputLabel = ({ htmlFor, required, children }: InputLabelProps) => {
  return (
    <>
      <BodyText
        size="md"
        component="label"
        color="secondary-800"
        fontWeight="Medium"
        htmlFor={htmlFor}
      >
        {children}
        {!!required && <RequiredMark>{` *`}</RequiredMark>}
      </BodyText>
    </>
  );
};

const RequiredMark = styled("span")`
  color: #df9000; // not in the palette
  padding-top: 12px;
`;

export default InputLabel;
