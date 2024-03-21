import { SxProps, Theme } from "@mui/material"
import MUITypography, { TypographyProps } from "@mui/material/Typography"
import { colors } from "shared/colors"


type ColorsType =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "success"
  | "grey"

type ColorsLevel =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"

enum WEIGHT_ENUM {
  Regular = 400,
  Medium = 500,
  SemiBold = 600,
  Bold = 700,
}

enum DISPLAY_SIZE_ENUM {
  lg = "h1",
  md = "h2",
  sm = "h3",
  xs = "h4",
}

interface DisplayProps {
  fontWeight?: keyof typeof WEIGHT_ENUM
  size?: keyof typeof DISPLAY_SIZE_ENUM
  color?: `${ColorsType}-${ColorsLevel}`
}

export const Display = <C extends React.ElementType>({
  fontWeight = "Medium",
  size = "lg",
  color = "grey-800",
  ...props
}: DisplayProps &
  Omit<
    TypographyProps<C, { component?: C }>,
    "fontWeight" | "size" | "variant" | "color"
  >) => {
  return (
    <MUITypography
      tabIndex={0}
      {...props}
      color={getColor(color)}
      fontWeight={WEIGHT_ENUM[fontWeight]}
      variant={DISPLAY_SIZE_ENUM[size]}
    />
  )
}

enum TEXT_SIZE_ENUM {
  md = "body1",
  sm = "body2",
  xs = "overline",
}
interface TextBodyProps {
  fontWeight?: keyof typeof WEIGHT_ENUM
  size?: keyof typeof TEXT_SIZE_ENUM
  color?: `${ColorsType}-${ColorsLevel}`
}

export const BodyText = <C extends React.ElementType>({
  fontWeight = "Regular",
  size = "md",
  color = "grey-800",
  ...props
}: TextBodyProps &
  Omit<
    TypographyProps<C, { component?: C }>,
    "fontWeight" | "size" | "variant" | "color"
  >) => {
  return (
    <MUITypography
      tabIndex={0}
      {...props}
      fontWeight={WEIGHT_ENUM[fontWeight]}
      variant={TEXT_SIZE_ENUM[size]}
      color={getColor(color)}
      sx={{
        ...props.sx,
        textTransform: "unset",
      }}
    />
  )
}

enum LABEL_SIZE_ENUM {
  sm,
  xs,
}

const labelStyles: Record<keyof typeof LABEL_SIZE_ENUM, SxProps<Theme>> = {
  sm: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    letterSpacing: "0.07rem",
  },
  xs: {
    fontSize: "0.75rem",
    lineHeight: "1.125rem",
    letterSpacing: "0.03rem",
  },
}

interface LabelProps {
  fontWeight?: keyof typeof WEIGHT_ENUM
  size?: keyof typeof LABEL_SIZE_ENUM
  mobile?: keyof typeof LABEL_SIZE_ENUM
  color?: `${ColorsType}-${ColorsLevel}`
}

export const Label = <C extends React.ElementType>({
  fontWeight = "Medium",
  size = "sm",
  mobile = "xs",
  color = "grey-800",
  ...props
}: LabelProps &
  Omit<
    TypographyProps<C, { component?: C }>,
    "fontWeight" | "size" | "variant" | "color"
  >) => {
  return (
    <MUITypography
      tabIndex={0}
      {...props}
      fontWeight={WEIGHT_ENUM[fontWeight]}
      variant="overline"
      color={getColor(color)}
      sx={{
        cursor: props.onClick ? "pointer" : "auto",
        typography: {
          sm: labelStyles[mobile],
          md: labelStyles[size],
        },
      }}
    />
  );
}


const getColor = (colorKey: `${ColorsType}-${ColorsLevel}`) => {
  const [name, level] = colorKey.split("-")

  return colors?.[name as ColorsType]?.[level as ColorsLevel]
}