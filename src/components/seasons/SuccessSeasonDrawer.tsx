import React from "react";
import { Drawer, Button } from "@mui/material";
import IconModalSeason from "../../../assets/icons/season.svg";
import { Display } from "ui/Typography"

interface SuccessDrawerProps {
  open: boolean
  dismiss: () => void
  data: any
}

const SuccessSeasonDrawer: React.FC<SuccessDrawerProps> = ({
  open,
  dismiss,
  data,
}) => {
  const name = data ? data.name : " "
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
          src={IconModalSeason}
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
            New Season Created!
          </Display>
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
            {"Harvest season "}
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
              {name}
            </span>
            {" has"}
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
            been created.
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
          Back to Harvest Season
        </Button>
      </div>
    </Drawer>
  )
}

export default SuccessSeasonDrawer;
