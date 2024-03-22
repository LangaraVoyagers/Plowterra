import { styled } from "@mui/material";

const StyledSpan = styled("span")`
  border-radius: ${({ theme }) => theme.spacing(0.5)};
  background: ${({ theme }) => theme.palette.grey[100]};
  padding: ${({ theme }) => theme.spacing(0.75)};
  width: 100%;
  min-width: 9.62rem;
  text-align: center;
`;

export default StyledSpan;
