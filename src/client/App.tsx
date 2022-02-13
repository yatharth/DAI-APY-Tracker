import React from 'react'
import {css} from '@emotion/css'
import {Graph} from './Graph'


const AppContainer = (props) => (
    <div className={css`

        /* Max width and centered. */
        max-width: 40em;
        margin: 0 auto;

        /* Center children horizontally. */
        display: flex;
        flex-direction: column;
        align-items: center;

        /* Aesthetics. */
        padding: 2em;
        font-family: sans-serif;

    `}>
        {props.children}
    </div>
)

const Header = () => (
    <>
        <h1 className={css`
            margin: 0;
        `}>
            DAI APY Tracker
        </h1>

        <div className={css`
            text-align: center;
            line-height: 1.2em;
        `}>
            <p>
                This tracker updates in real-time.
            </p>
            <p>
                By default, it shows data from the last 7 days.<br/>
                To load older, historical data, click the button below.
            </p>
        </div>
    </>
)

function App() {
    return (
        <AppContainer>
            <Header/>
            <Graph/>
        </AppContainer>
    )
}

export default App