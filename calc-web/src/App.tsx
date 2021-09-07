import React from 'react';
import styled, { createGlobalStyle } from "styled-components";
import { CalculationForm } from './Form/CalculationForm';
import { CalculationList } from './List/CalculationList';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`

const Main = styled.main`
  max-width: 800px;
  margin: 0 auto;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 64px;
  }
`;

function App() {
  return (
    <Main>
      <GlobalStyles />
      <h1>Factorials'r'us</h1>
      <Column>
        <CalculationForm />
        <CalculationList />
      </Column>
    </Main>
  );
}

export default App;
