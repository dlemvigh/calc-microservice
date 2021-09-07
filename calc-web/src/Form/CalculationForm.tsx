import React, { useCallback } from "react";
import { Formik, FormikHelpers } from "formik";
import { Button } from "@material-ui/core";
import { CalculationInput } from "./CalculationInput";
import * as Yup from "yup";
import { Row } from "../Components/Flex";
import { useCreateFactorial } from "../Query/factorial";

const validationSchema = Yup.object().shape({
    input: Yup.number()
        .min(0, "Must be a positive number")
        .integer("Must be a whole number")
        .required("Required")
})

interface FormValues {
    input: number;
}

export function CalculationForm() {
    const mutate = useCreateFactorial();

    const handleSubmit = useCallback(async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
        await mutate.mutateAsync({ input: values.input });
        // await postFactorial({ input: values.input });
        helpers.resetForm();
    }, [mutate]);

    return (
        <Formik
            initialValues={{ input: 2000 }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <Row style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
                        <CalculationInput />
                        <Button variant="contained" color="primary" type="submit">calc</Button>
                    </Row>
                </form>
            )}
        </Formik>
    )
}