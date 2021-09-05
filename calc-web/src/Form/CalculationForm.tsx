import React from "react";
import { Formik } from "formik";
import { Button } from "@material-ui/core";
import { CalculationInput } from "./CalculationInput";
import * as Yup from "yup";
import { Row } from "../Components/Flex";

const validationSchema = Yup.object().shape({
    input: Yup.number()
        .min(0, "Must be a positive number")
        .integer("Must be a whole number")
        .required("Required")
})

export function CalculationForm() {
    return (
        <Formik
            initialValues={{ input: 2000 }}
            validationSchema={validationSchema}
            onSubmit={() => { }}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <Row style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
                        <CalculationInput />
                        <Button variant="contained" color="primary">calc</Button>
                    </Row>
                </form>
            )}
        </Formik>
    )
}