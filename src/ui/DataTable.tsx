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
import EmptyState, { EmptyStateProps } from "./EmptyState";

type DataTableProps<T extends GridValidRowModel> = DataGridProps<T> & {
  emptyState: EmptyStateProps;
};

const DataTable = <T extends GridValidRowModel>({
  emptyState,
  ...props
}: DataTableProps<T>) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  if (!props.rows.length && !props.loading) {
    return <EmptyState {...emptyState} />;
  }

  return (
    <>
      <StyledContainer pb={!desktop ? "5rem" : undefined}>
        <DataGrid
          getRowId={(data) => data?._id ?? data?.id}
          {...props}
          initialState={{
            ...props.initialState,
            pagination: {
              ...props.initialState?.pagination,
              paginationModel: {
                ...props.initialState?.pagination?.paginationModel,
                pageSize: !desktop ? 20 : undefined,
              },
            },
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          slots={{
            pagination: !desktop ? Pagination : undefined,
          }}
          autoPageSize={!!desktop}
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
      position="fixed"
      bottom={0}
      left={0}
      display="flex"
      justifyContent="space-between"
      paddingLeft="2rem"
      paddingRight="2rem"
      paddingTop="1rem"
      paddingBottom="1rem"
      alignItems="center"
    >
      <PageStepper
        onClick={() => {
          if (page > 0) {
            apiRef.current.setPage(page - 1);
          }
        }}
      >
        <CaretLeft size="1.5rem" />
      </PageStepper>

      {pageCount > 0 && (
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
      )}
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
    background: ${({ theme }) => theme.palette.background.default};
  }

  .MuiDataGrid-columnHeaders {
    border-radius: 0.75rem 0.75rem 0 0;
    background: ${({ theme }) => theme.palette.grey[200]};
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[300]};

    /* Capital Label 2/Medium */
    font-size: 0.75rem;
    font-weight: 500 !important;
    line-height: 1.125rem !important;
    letter-spacing: 0.03rem;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.grey[700]};
  }

  .MuiDataGrid-virtualScroller {
    border-radius: 0 0 0.75rem 0.75rem;
    color: ${({ theme }) => theme.palette.grey[800]};
  }

  .MuiDataGrid-virtualScrollerContent > div {
    background: ${({ theme }) => theme.palette.background.paper};
  }

  .MuiDataGrid-virtualScrollerRenderZone > div:nth-last-child(1) {
    border-radius: 0 0 0.75rem 0.75rem;
    border: 0;

    .MuiDataGrid-cell {
      border-bottom: 0;
    }
  }

  .MuiDataGrid-virtualScrollerRenderZone {
    box-shadow: 0px 2px 4px 0px rgba(29, 33, 45, 0.08),
      0px 0px 2px 0px rgba(29, 33, 45, 0.08),
      0px 0px 1px 0px rgba(29, 33, 45, 0.2);
  }

  .MuiDataGrid-virtualScrollerContent > div:nth-last-child(1) {
    border-radius: 0 0 0.75rem 0.75rem;
  }

  .MuiDataGrid-overlay {
    background: ${({ theme }) => theme.palette.background.paper};
  }

  .MuiDataGrid-footerContainer {
    min-height: 0;
    border-top: 0;
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
