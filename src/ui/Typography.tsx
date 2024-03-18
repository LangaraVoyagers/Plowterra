import { SxProps, Theme } from "@mui/material"
import MUITypography, { TypographyProps } from "@mui/material/Typography"

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
}

export const Display = <C extends React.ElementType>({
  fontWeight = "Medium",
  size = "lg",
  ...props
}: DisplayProps &
  Omit<
    TypographyProps<C, { component?: C }>,
    "fontWeight" | "size" | "variant"
  >) => {
  return (
    <MUITypography
      tabindex={0}
      {...props}
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
}

export const BodyText = <C extends React.ElementType>({
  fontWeight = "Regular",
  size = "md",
  ...props
}: TextBodyProps &
  Omit<
    TypographyProps<C, { component?: C }>,
    "fontWeight" | "size" | "variant"
  >) => {
  return (
    <MUITypography
      tabindex={0}
      {...props}
      fontWeight={WEIGHT_ENUM[fontWeight]}
      variant={TEXT_SIZE_ENUM[size]}
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
}

export const Label = <C extends React.ElementType>({
  fontWeight = "Medium",
  size = "sm",
  mobile = "xs",
  ...props
}: LabelProps &
  Omit<
    TypographyProps<C, { component?: C }>,
    "fontWeight" | "size" | "variant"
  >) => {
  return (
    <MUITypography
      tabindex={0}
      {...props}
      fontWeight={WEIGHT_ENUM[fontWeight]}
      variant="overline"
      sx={{
        typography: {
          sm: labelStyles[mobile],
          md: labelStyles[size],
        },
      }}
    />
  )
}
