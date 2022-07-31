import { ReactNode } from "react";
import GlobalStyles from "./GlobalStyles";

export interface PlaywrightWrapperProps {
    children: ReactNode;
}
export function PlaywrightWrapper({ children }: PlaywrightWrapperProps): JSX.Element {
    return (
        <div>
            <GlobalStyles />
            {children}
        </div>
    );
}