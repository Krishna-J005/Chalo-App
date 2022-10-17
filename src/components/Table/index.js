import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'


export default function Tables(props) {
    const columns = props.columns
    const rowsPerPageOptions = [10, 20, 50]
    const pages = 'route'
    const buttons = props.buttons
    const navigate = useNavigate();
    const [rows, setRows] = useState([])
    const [count, setCount] = useState(props?.rows?.length || 0)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = e => {
        setRowsPerPage(e.target.value);
        setPage(0);
    };



    const createOrder = (e) => {
        e.preventDefault()
        navigate("addRoute")
    }
    useEffect(() => {
        // debugger
        setRows(props?.rows)
        setCount(props?.rows?.length)
        setPage(0)
    }, [props?.rows])





    const deleteRow = async (e, id) => {
        e.preventDefault()
        const localData = JSON.parse(localStorage.getItem('data'))
        const filterData = localData.filter(curr => curr.routeId !== id)
        localStorage.setItem('data', JSON.stringify(filterData))
        navigate('/')
    }


    return (
        <>
            <Button style={{ margin: 10 }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={false}
                onClick={createOrder}
            >
                Create {pages}
            </Button>

            <Paper>
                <TableContainer>
                    {rows && <TablePagination
                        rowsPerPageOptions={rowsPerPageOptions}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />}
                    <Table >
                        <TableHead >
                            <TableRow>
                                {columns.map(column => (
                                    <TableCell
                                        key={column.id}
                                        align='center'
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.length > 0 ? (
                                rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, id) => {
                                    return (
                                        <TableRow key={id} hover>
                                            {Object.keys(val).map((curr, index) =>
                                                <TableCell align='center' key={index}>{val[curr]}</TableCell>
                                            )
                                            }
                                            {
                                                <TableCell style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    {
                                                        buttons?.map((button, index) => (
                                                            button?.id === 'edit' ?
                                                                <Link to={`./editRoute/${val.routeId}`}>
                                                                    <Tooltip title={button.label}>
                                                                        <EditIcon
                                                                            style={{ pointerEvents: 'cursor' }}
                                                                        />
                                                                    </Tooltip>

                                                                </Link>
                                                                :
                                                                button?.id === 'view' ?
                                                                    <Link to={`./viewRoute/${val.routeId}`}>
                                                                        <Tooltip title={button.label}>
                                                                            <RemoveRedEyeIcon
                                                                                style={{ pointerEvents: 'cursor' }}
                                                                            />
                                                                        </Tooltip>

                                                                    </Link>
                                                                    :
                                                                    <Tooltip title="Delete">
                                                                        <DeleteOutlinedIcon
                                                                            style={{ pointerEvents: 'auto' }}
                                                                            onClick={(e) => deleteRow(e, val["routeId"])}
                                                                        />
                                                                    </Tooltip>
                                                        ))
                                                    }
                                                </TableCell>


                                            }

                                        </TableRow>
                                    )
                                }))
                                :
                                <TableRow>
                                    <TableCell>No Data Found</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
}

