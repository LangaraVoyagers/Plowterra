import { Box, styled, useMediaQuery, useTheme } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridValidRowModel,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { BodyText } from "./Typography";

type DataTableProps<T extends GridValidRowModel> = DataGridProps<T>;

const DataTable = <T extends GridValidRowModel>(props: DataTableProps<T>) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <StyledContainer pb={!desktop ? "6rem" : undefined}>
        <DataGrid
          getRowId={(data) => data?._id ?? data?.id}
          {...props}
          pageSizeOptions={[10, 20, 50, 100]}
          autoPageSize
          slots={{
            pagination: !desktop ? Pagination : undefined,
          }}
        />
      </StyledContainer>
    </>
  );
};

const Pagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <StyledFooter
      height="6rem"
      position="fixed"
      bottom={0}
      left={0}
      display="flex"
      justifyContent="space-between"
      paddingLeft="2rem"
      paddingRight="2rem"
      alignItems="center"
    >
      <PageStepper
        onClick={() => {
          apiRef.current.setPage(page - 1);
        }}
      >
        <CaretLeft size="1.5rem" />
      </PageStepper>

      <Box display="flex" gap="0.25rem">
        <BodyText size="md" fontWeight="Medium">
          {page + 1}
        </BodyText>
        <BodyText size="md" fontWeight="Medium" color="grey-400">
          /
        </BodyText>
        <BodyText size="md" fontWeight="Medium" color="grey-400">
          {pageCount}
        </BodyText>
      </Box>
      <PageStepper
        onClick={() => {
          apiRef.current.setPage(page + 1);
        }}
      >
        <CaretRight size="1.5rem" />
      </PageStepper>
    </StyledFooter>
  );
};

const StyledContainer = styled(Box)`
  width: 100%;

  .MuiDataGrid-root {
    border-radius: 0.75rem 0.75rem 0 0;
    border: 0;
    box-shadow: 0px 2px 4px 0px rgba(29, 33, 45, 0.08),
      0px 0px 2px 0px rgba(29, 33, 45, 0.08),
      0px 0px 1px 0px rgba(29, 33, 45, 0.2);

    background: ${({ theme }) => theme.palette.background.paper};
  }
  .MuiDataGrid-columnHeaders {
    border-radius: 0.75rem 0.75rem 0 0;
    background: ${({ theme }) => theme.palette.grey[200]};
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[300]};
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.grey[700]};
    /* Capital Label 2/Medium */
    font-size: 0.75rem;
    font-weight: 500 !important;
    line-height: 1.125rem !important;
    letter-spacing: 0.03rem;
  }

  .MuiDataGrid-virtualScroller {
    color: ${({ theme }) => theme.palette.grey[800]};
  }

  .MuiDataGrid-footerContainer {
    min-height: 0;
  }
`;

const StyledFooter = styled(Box)`
  width: 100%;
  background: ${({ theme }) => theme.palette.grey[50]};
  border-top: 1px solid ${({ theme }) => theme.palette.grey[200]};
`;

const PageStepper = styled(Box)`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.palette.grey[200]};
  cursor: pointer;
`;

export default DataTable;
