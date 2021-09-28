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
                    <TableCell style={{ width: "6em" }}>
                        n
                    </TableCell>
                    <TableCell>
                        n!
                    </TableCell>
                    <TableCell style={{ width: "6em" }}>
                        queue time
                    </TableCell>
                    <TableCell style={{ width: "5em" }}>
                        work time
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((item, index) => (
                    <CalculationRow key={item.id} index={index} item={item} />
                ))}
            </TableBody>
        </Table >
    )
}

interface CalculationRowProps {
    index: number;
    item: Job;
}

export function CalculationRow({ index, item }: CalculationRowProps) {
    return (
        <TableRow key={item.id}>
            <TableCell data-testid={`row-${index}-input`}>{item.input.toLocaleString("da-dk")}</TableCell>
            <TableCell data-testid={`row-${index}-output`}>{item.output || "-"}</TableCell>
            <TableCell data-testid={`row-${index}-queue-time`}><TimeDiff from={item.createdAt} to={item.calcStartedAt} /></TableCell>
            <TableCell data-testid={`row-${index}-work-time`}><TimeDiff from={item.calcStartedAt} to={item.finishedAt} /></TableCell>
        </TableRow>
    );
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