import React from "react";
import { Drawer, Button } from "@mui/material";
import IconPicker from "../../../assets/icons/picker.svg";
import { BodyText, Display } from "ui/Typography";

interface SuccessDrawerProps {
  open: boolean;
  dismiss: () => void;
  data: any;
}

const SuccessPickerDrawer: React.FC<SuccessDrawerProps> = ({
  open,
  dismiss,
  data,
}) => {
  const name = data ? data.name : ' ';
  return (
    <Drawer anchor="right" open={open} onClose={dismiss}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
        }}
      >
        <img
          src={IconPicker}
          alt="Icon Picker"
          style={{
            width: "221px",
            height: "229px",
            marginTop: "16px",
          }}
        />
        <div style={{ width: 600, padding: 20 }}>
        <Display
            color="grey-800"
            size="sm"
            fontWeight="SemiBold"
            style={{
              textAlign: "center",
              marginTop: "45px",
              marginBottom: "24px",
            }}
          >
            New Picker Added!
          </Display>
          <BodyText
            size="md"
            style={{
              color: "grey-800",
              textAlign: "center",
              fontWeight: "Medium",
            }}
          >
            You have successfully added
          </BodyText>
          <BodyText
            size="md"
            style={{
              color: "grey-800",
              textAlign: "center",
              fontWeight: "Medium",
            }}
          >
            <span
              style={{
                color: "var(--Colors-Secondary-700, #9E6600)",
                fontStyle: "normal",
                fontWeight: "Bold",
              }}
            >
              {name}
            </span>
            {" to your picker list."}
          </BodyText>
        </div>
        <Button
          onClick={dismiss}
          variant="contained"
          color="primary"
          autoFocus
          style={{
            flex: 1,
            marginLeft: "12px",
            height: "56px",
            marginTop: "72px",
          }}
        >
          Back to Picker List
        </Button>
      </div>
    </Drawer>
  );
};

export default SuccessPickerDrawer;
