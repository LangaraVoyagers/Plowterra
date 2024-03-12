import { BodyText, Display } from "ui/Typography";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
interface BasicHomeProps {
  breadcrumb: Array<{ title: React.ReactNode; href: string }>;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

function BasicHome({
  breadcrumb,
  title,
  subtitle,
  actions,
  children,
}: BasicHomeProps) {
  return (
    <Box display="flex" flexDirection="column" height="100%" gap={8}>
      <Box component="header" display="flex" flexDirection="column" gap={4}>
        <Breadcrumbs 
          separator="/" 
          maxItems={3} 
          aria-label="breadcrumb">
          {breadcrumb.map((item, index) => {
            return (
              <Link 
                underline="none"
                key={ index } 
                href={ item.href }>
                <Typography fontWeight={(index == breadcrumb.length - 1) ? 700 : 400}>
                  { item.title }
                </Typography>
              </Link>
            )
          })}
        </Breadcrumbs>

        <Box display="flex" justifyContent="space-between">
          <Box display="flex" flexDirection="column" gap={1}>
            <Display>{title}</Display>
            <BodyText sx={{ display: !subtitle ? "none" : "initial" }}>
              {subtitle}
            </BodyText>
          </Box>

          <Box alignSelf="flex-end">{actions}</Box>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" height="100%" gap={4}>
        {children}
      </Box>
    </Box>
  );
}

export default BasicHome;
