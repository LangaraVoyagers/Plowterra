import { Box, styled } from "@mui/material";

const Tag = styled(Box)`
  border-radius: 4px;
  padding: 0 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey[300]};
  background: ${({ theme }) => theme.palette.grey[100]};
  color: ${({ theme }) => theme.palette.grey[600]};
  width: fit-content;
  height: fit-content;
  font-size: 0.5rem;
  font-weight: 600;
  line-height: 18px;
`;

export default Tag;
