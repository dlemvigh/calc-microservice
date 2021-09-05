import styled, { css } from "styled-components";

interface FlexProps {
    space?: number;
}

export const Row = styled.div<FlexProps>`
    display: flex;

    ${p => p.space && css`
        > * + * {
            margin-left: ${p.space}px;
        }
    `}
`

export const Column = styled.div<FlexProps>`
    display: flex;
    flex-direction: column;

    ${p => p.space && css`
        > * + * {
            margin-top: ${p.space}px;
        }
    `}
`;