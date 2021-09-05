import React from "react";
import { TextField } from "@material-ui/core"
import { useField } from "formik";

export function CalculationInput() {
    const [field, meta] = useField({ name: "input" })
    return (
        <>
            <TextField id="factorial-input" label="Input" type="number" {...field} error={!!meta.error} helperText={meta.error} inputProps={{ min: 0, step: 1 }} />
            {/* <pre>{JSON.stringify(meta, null, 2)}</pre> */}
        </>
    )
}