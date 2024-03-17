import React from "react";
import { Drawer, Button } from "@mui/material";
import IconPicker from "../../../assets/icons/picker.svg";

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
  console.log(data.name);
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
          <p
            style={{
              color: "var(--Colors-Gray-warm-800, #292524)",
              fontVariantNumeric: "lining-nums tabular-nums",
              fontFeatureSettings: "'liga' off",
              fontSize: 30,
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "38px",
              letterSpacing: "-0.3px",
              textAlign: "center",
              marginTop: "45px",
              marginBottom: "24px",
            }}
          >
            New Picker Added!
          </p>
          <p
            style={{
              color: "var(--Colors-Gray-warm-800, #292524)",
              textAlign: "center",
              fontVariantNumeric: "lining-nums tabular-nums",
              fontFeatureSettings: "'liga' off",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            You have successfully added
          </p>
          <p
            style={{
              color: "var(--Colors-Gray-warm-800, #292524)",
              textAlign: "center",
              fontVariantNumeric: "lining-nums tabular-nums",
              fontFeatureSettings: "'liga' off",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            <span
              style={{
                color: "var(--Colors-Secondary-700, #9E6600)",
                fontVariantNumeric: "lining-nums tabular-nums",
                fontFeatureSettings: "'liga' off",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
              }}
            >
              {data.name}
            </span>
            {" to your picker list."}
          </p>
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
