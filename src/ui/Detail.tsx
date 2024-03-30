import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { BodyText, Display, Label } from "./Typography";

type DetailProps = {
  category: string;
  title?: string;
  data: (string | number | React.ReactNode)[][];
  subfooter: (string | number | React.ReactNode)[][];
  footer: (string | number | React.ReactNode)[][];
};
const Detail = ({ category, title, data, subfooter, footer }: DetailProps) => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <>
      <Box display="flex" flexDirection="column" paddingX={"1.5rem"}>
        <Label size="xs" fontWeight="Medium" color="grey-500">
          {category}
        </Label>
        <Display size="md" component="h1" fontWeight="SemiBold">
          {title}
        </Display>
      </Box>

      <Box display="flex" flexDirection="column">
        <TableContainer>
          <Table aria-label="Harvest log detail table">
            <TableHead
              sx={{
                background: theme.palette.grey[200],
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    paddingLeft: "1.5rem",
                  }}
                >
                  <Label size="sm" color="grey-800" fontWeight="Bold">
                    {intl.formatMessage({
                      id: "detail.category.label",
                      defaultMessage: "CATEGORY",
                    })}
                  </Label>
                </TableCell>
                <TableCell>
                  <Label size="sm" color="grey-800" fontWeight="Bold">
                    {intl.formatMessage({
                      id: "detail.info.label",
                      defaultMessage: "INFO",
                    })}
                  </Label>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      borderColor: theme.palette.grey[50],
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <BodyText size="md" fontWeight="Medium">
                      {row[0]}
                    </BodyText>
                  </TableCell>
                  <TableCell sx={{ borderColor: theme.palette.grey[50] }}>
                    {typeof row[1] !== "object" ? (
                      <BodyText size="md">{row[1]}</BodyText>
                    ) : (
                      row[1]
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {subfooter.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ background: theme.palette.grey[100] }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      border: 0,

                      paddingLeft: "1.5rem",
                    }}
                  >
                    <BodyText size="md" fontWeight="Medium">
                      {row[0]}
                    </BodyText>
                  </TableCell>
                  <TableCell sx={{ border: 0 }}>
                    {typeof row[1] !== "object" ? (
                      <BodyText size="md">{row[1]}</BodyText>
                    ) : (
                      row[1]
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {footer.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ background: theme.palette.grey[200] }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <BodyText size="md" fontWeight="Medium">
                      {row[0]}
                    </BodyText>
                  </TableCell>
                  <TableCell>
                    {typeof row[1] !== "object" ? (
                      <BodyText size="md">{row[1]}</BodyText>
                    ) : (
                      row[1]
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Detail;
