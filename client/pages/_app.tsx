import type { AppProps } from 'next/app';
import type { Page } from '../types/types';
import React, {createContext, StrictMode, useContext, useEffect} from 'react';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import './auth/style.scss'
import App from "./App";
import Store from "../store/store";
// @ts-ignore
import {Props} from "next/script";

type Props = AppProps & {
    Component: Page;
};

interface State {
    store: Store;
}

const store = new Store();

export const Context = createContext<State>({
    store,
})


export default function MyApp({ Component, pageProps }: Props) {

    return (
        <Context.Provider value={{ store }}>
            <StrictMode>
                <App
                    // @ts-ignore
                    Component={Component}
                    pageProps={pageProps}
                />
            </StrictMode>
        </Context.Provider>
    );
}
