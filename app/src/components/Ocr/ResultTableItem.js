import React from 'react'
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export default function ResultTableItem(props) {

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
                <img src={props.based64} alt={props.index} />
            </TableCell>
            <TableCell align="right">{props.text}</TableCell>
        </TableRow>
    )
}
