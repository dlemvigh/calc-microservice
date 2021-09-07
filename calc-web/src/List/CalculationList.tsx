import React from "react";
import { useAsync } from "react-async";
import { Table, TableBody, TableRow, TableCell, TableHead } from "@material-ui/core"
import { getFactorials } from "../Query/factorial";

export function CalculationList() {
    const { data } = useAsync({
        promiseFn: getFactorials
    })

    return (
        <>
            {data && <CalculationTable data={data} />}
        </>
    )
}

interface CalculationTableProps {
    data: {
        id: number;
        input: number;
    }[];
}

function CalculationTable({ data }: CalculationTableProps) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        n
                    </TableCell>
                    <TableCell>
                        n!
                    </TableCell>
                    <TableCell>
                        time
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(item => (
                    <TableRow key={item.id}>
                        <TableCell>{item.input}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

}