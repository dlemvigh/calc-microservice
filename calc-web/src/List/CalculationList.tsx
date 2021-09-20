import React, { useMemo } from "react";

import { useFactorials, useFactorialSubscription, Job } from "../Query/factorial";
import { Table, TableBody, TableRow, TableCell, TableHead } from "@material-ui/core"

export function CalculationList() {
    const { data } = useFactorials();
    useFactorialSubscription();
    return (
        <>
            {data && <CalculationTable data={data} />}
        </>
    )
}

interface CalculationTableProps {
    data: Job[];
}

export function CalculationTable({ data }: CalculationTableProps) {
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
                        queue time
                    </TableCell>
                    <TableCell>
                        work time
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(item => (
                    <TableRow key={item.id}>
                        <TableCell>{item.input}</TableCell>
                        <TableCell>{item.output || "-"}</TableCell>
                        <TableCell><TimeDiff from={item.createdAt} to={item.calcStartedAt} /></TableCell>
                        <TableCell><TimeDiff from={item.calcStartedAt} to={item.finishedAt} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table >
    )
}
interface CalculationTimeProps {
    from?: string;
    to?: string;
}
function TimeDiff({ from, to }: CalculationTimeProps): JSX.Element {
    const createdDate = useMemo(() => from && new Date(from), [from]);
    const finishedDate = useMemo(() => to && new Date(to), [to]);

    if (!createdDate) {
        return <>-</>;
    }

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