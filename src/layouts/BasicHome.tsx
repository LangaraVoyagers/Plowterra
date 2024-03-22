import { BodyText, Display } from "ui/Typography"
import {
  Box,
  Breadcrumbs,
  Link,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material"

interface BasicHomeProps {
  breadcrumb: Array<{ title: React.ReactNode; href: string }>
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export default function BasicHome({
  breadcrumb,
  title,
  subtitle,
  actions,
  children,
}: BasicHomeProps) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Container display="flex" flexDirection="column" height="100%" gap={3}>
      <Box component="header" display="flex" flexDirection="column" gap={4}>
        {!mobile && (
          <Breadcrumbs maxItems={3} aria-label="breadcrumb">
            {breadcrumb?.map((item, index) => {
              if (index === breadcrumb.length - 1) {
                return (
                  <BodyText
                    key={index}
                    color="grey-800"
                    fontWeight="SemiBold"
                    tabIndex={0}
                  >
                    {item.title}
                  </BodyText>
                );
              }

              return (
                <Link
                  key={index}
                  underline="hover"
                  color="inherit"
                  href={item.href}
                >
                  {item.title}
                </Link>
              )
            })}
          </Breadcrumbs>
        )}

        <Header display="flex" flexDirection="column" gap={1.25}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Display
              size="lg"
              tabIndex={0}
              fontWeight="Bold"
              sx={{ typography: { md: "SemiBold" } }}
            >
              {title}
            </Display>
            <BodyText
              tabIndex={0}
              sx={{ display: !subtitle ? "none" : "initial" }}
            >
              {subtitle}
            </BodyText>
          </Box>

          <Box>{actions}</Box>
        </Header>
      </Box>

      <Box display="flex" flexDirection="column" height="100%" gap={2}>
        {children}
      </Box>
    </Container>
  )
}

const Container = styled(Box)`
  gap: ${({ theme }) => theme.spacing(3)};
  ${(props) => props.theme.breakpoints.up("sm")} {
    gap: ${({ theme }) => theme.spacing(8)};
  }
`

const Header = styled(Box)`
  ${(props) => props.theme.breakpoints.up("sm")} {
    flex-direction: row;
    justify-content: space-between;
  }
`
