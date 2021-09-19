import React, { useMemo } from "react";

import { useFactorials } from "../Query/factorial";
import { Table, TableBody, TableRow, TableCell, TableHead } from "@material-ui/core"

export function CalculationList() {
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
        output?: string;
        createdAt: string;
        finishedAt?: string;
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
                {data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(item => (
                    <TableRow key={item.id}>
                        <TableCell>{item.input}</TableCell>
                        <TableCell><CalculationResult value={item.output} maxLength={20} /></TableCell>
                        <TableCell><CalculationTime from={item.createdAt} to={item.finishedAt} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

interface CalculationResultProps {
    value?: string;
    maxLength: number;
}

function CalculationResult({ value, maxLength }: CalculationResultProps): JSX.Element {
    if (!value) {
        return <>-</>
    }

    if (value.length < maxLength) {
        return <>value</>
    }

    return <>{value.substr(0, maxLength)}e<sup>{value.length - maxLength}</sup></>
}

interface CalculationTimeProps {
    from: string;
    to?: string;
}
function CalculationTime({ from, to }: CalculationTimeProps): JSX.Element {
    const createdDate = useMemo(() => new Date(from), [from]);
    const finishedDate = useMemo(() => to && new Date(to), [to]);

    if (!finishedDate) {
        return <>-</>;
    }

    const diff = finishedDate.getTime() - createdDate.getTime()

    if (diff < 1000) {
        return <>{diff}ms</>
    }

    if (diff < 60 * 1000) {
        return <>{Math.floor(diff / 100) / 10}s</>
    }

    if (diff < 60 * 60 * 1000) {
        return <>{Math.floor(diff / (60 * 1000))}s</>
    }

    return <>{Math.floor(diff / (60 * 60 * 1000))}</>
}