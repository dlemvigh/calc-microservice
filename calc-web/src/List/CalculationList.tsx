import React from "react";
// import { useAsync } from "react-async";
import { useFactorials } from "../Query/factorial";
import { Table, TableBody, TableRow, TableCell, TableHead } from "@material-ui/core"

export function CalculationList() {
    // const { data } = useAsync({
    //     promiseFn: getFactorials
    // })
    const { data } = useFactorials();

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