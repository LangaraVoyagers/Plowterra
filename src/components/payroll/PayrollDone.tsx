import { Box, Button, styled, useTheme } from "@mui/material";
import { ArrowLeft, SealCheck } from "@phosphor-icons/react";
import { FormattedMessage } from "react-intl";
import { BodyText, Display } from "ui/Typography";

const PayrollDone = () => {
  const theme = useTheme();

  return (
    <Card>
      <SealCheck size={32} weight="fill" color={theme.palette.primary.main} />
      <Box display="flex" flexDirection="column" gap="1.5rem">
        <Box display="flex" flexDirection="column" gap="0.5rem">
          <Display size="xs" fontWeight="Medium">
            You successfully ran the payroll!
          </Display>

          <BodyText fontWeight="Medium" color="grey-500">
            Time to sit back and relax! Your payroll run was successful. You can
            check the latest payroll summary below.
          </BodyText>
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={() => (window.location.href = "/payroll")}
            startIcon={<ArrowLeft size="1.25rem" />}
          >
            <FormattedMessage
              id="payroll.done.button"
              defaultMessage="Go back to payroll history"
            />
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default PayrollDone;

const Card = styled(Box)`
  background: ${({ theme }) => theme.palette.grey[200]};

  border-radius: 0.5rem;
  display: flex;
  width: 100%;
  padding: 1.5rem;
  align-items: flex-start;
  gap: 0.56rem;
`;
