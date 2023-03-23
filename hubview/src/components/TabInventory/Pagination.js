import TablePagination from '@mui/material/TablePagination';

export default function TabPagination (props) {

    const { rows, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = props;
    
    return (
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                labelRowsPerPage={'Lignes par page'}
            />
    );
}