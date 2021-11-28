import GlobalStyles from "./GlobalStyles";
import { ReactNode } from "react"
import styled from "styled-components";

const Main = styled.main`
  max-width: 800px;
  margin: 0 auto;
`

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <Main>
            <GlobalStyles />
            {children}
        </Main>
    )
}

export default Layout;