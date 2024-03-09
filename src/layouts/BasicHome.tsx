import { Box, Breadcrumbs, Link } from "@mui/material";
import { BodyText, Display } from "ui/Typography";

interface BasicHomeProps {
  breadcrumb: Array<{ title: React.ReactNode; href: string }>;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function BasicHome({
  breadcrumb,
  title,
  subtitle,
  actions,
  children,
}: BasicHomeProps) {
  return (
    <Box display="flex" flexDirection="column" height="100%" gap={8}>
      <Box component="header" display="flex" flexDirection="column" gap={4}>
        <Breadcrumbs maxItems={2} aria-label="breadcrumb">
          {breadcrumb.map((item, index) => {
            if (index === breadcrumb.length - 1) {
              return (
                <BodyText key={index} color="text.primary" fontWeight="Medium">
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
            );
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
