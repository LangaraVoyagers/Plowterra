import {
  Dialog,
  DialogActions,
  Button,
  DialogProps,
  Box,
  Divider,
} from "@mui/material";
import { FormattedDate, FormattedNumber } from "react-intl";
import { Display } from "ui/Typography";
import IconModalPayroll from "../../assets/images/PayrollSuccess.svg";
import StyledSpan from "ui/StyledSpan";
import { useIntl } from "react-intl";

interface PayrollConfirmationModalProps extends DialogProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  data: {
    seasonName?: string;
    startDate?: Date;
    endDate?: Date;
    netAmount?: number;
    currency?: string;
  };
}

const PayrollConfirmationModal = ({
  onCancel,
  onConfirm,
  data,
  isLoading,
  ...props
}: PayrollConfirmationModalProps) => {
  const intl = useIntl();
  return (
    <Dialog
      {...props}
      aria-labelledby="payroll-confirmation-modal"
      aria-describedby="presenting the summary of the payroll we are about to save"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap="1.5rem"
        alignItems="center"
        padding="2rem"
      >
        <img
          src={IconModalPayroll}
          alt="a pair of hands holding a dollar bill"
          style={{
            width: "5rem",
            height: "5rem",
          }}
        />

        <Display color="grey-900" size="sm" fontWeight="SemiBold">
          {intl.formatMessage({
            id: "payroll.confirmation.modal.title",
            defaultMessage: "Ready to run the payroll?",
          })}
        </Display>

        <Box display="flex" gap="1.5rem" flexShrink={0} width="100%">
          <StyledSpan>{data.seasonName}</StyledSpan>
          <StyledSpan>
            <FormattedDate value={data.startDate} month="short" day="numeric" />
            -
            <FormattedDate value={data.endDate} month="short" day="numeric" />
          </StyledSpan>
          <StyledSpan>
            {data.currency} <FormattedNumber value={data.netAmount || 0} />
          </StyledSpan>
        </Box>
      </Box>
      <Divider sx={{ marginX: "2rem" }} />

      <DialogActions>
        <Box display="flex" gap="1.5rem" width="100%" padding="2rem">
          <Button
            onClick={onCancel}
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {intl.formatMessage({
              id: "payroll.confirmation.modal.cancel",
              defaultMessage: "Cancel",
            })
            }
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
            autoFocus
          >
            {isLoading ? "Loading..." : "Confirm"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollConfirmationModal;
