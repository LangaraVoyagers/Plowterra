import { DataGrid, DataGridProps, GridValidRowModel } from "@mui/x-data-grid"

type DataTableProps<T extends GridValidRowModel> = DataGridProps<T>

const DataTable = <T extends GridValidRowModel>(props: DataTableProps<T>) => {
  return (
    <DataGrid
      getRowId={(data) => data?._id ?? data?.id}
      {...props}
      pageSizeOptions={[10, 20, 50, 100]}
      initialState={{
        ...props.initialState,
        pagination: {
          ...props.initialState?.pagination,
          paginationModel: {
            ...props.initialState?.pagination?.paginationModel,
            pageSize: 12,
          },
        },
      }}
    />
  )
}

export default DataTable
