import { Box, styled } from "@mui/material";
import { Display, BodyText } from "./Typography";

export type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
};

const EmptyState = ({ title, subtitle, icon }: EmptyStateProps) => {
  return (
    <StyledEmptyState
      padding="6rem"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="1.25rem"
      marginBottom="3rem"
    >
      <Box width="4rem" height="4rem" position="relative">
        {icon}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        gap="1rem"
      >
        <Display size="xs" fontWeight="SemiBold" color="grey-500">
          {title}
        </Display>

        <BodyText size="md" fontWeight="Medium" color="grey-500">
          {subtitle}
        </BodyText>
      </Box>
    </StyledEmptyState>
  );
};

export default EmptyState;

const StyledEmptyState = styled(Box)`
  width: 100%;
  background: ${({ theme }) => theme.palette.grey[50]};
  color: ${({ theme }) => theme.palette.grey[500]};
  border-radius: 0.5rem;
`;
