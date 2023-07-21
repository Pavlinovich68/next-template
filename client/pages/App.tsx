import {observer} from "mobx-react-lite";
import React, {FC, StrictMode, useContext, useEffect} from "react";
import {LayoutProvider} from "../layout/context/layoutcontext";
import Layout from "../layout/layout";
import {Context} from "./_app";
import LoginPage from "./auth/login";

// @ts-ignore
const App: FC = ({ Component, pageProps })  => {
    const {store} = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }
    const start = () => {
        if (!store.isAuth) {
            return <LoginPage/>
        }

        if (Component.getLayout) {
            return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
        } else {
            return (
                <LayoutProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </LayoutProvider>
            );
        }
    }

    return (<div>{start()}</div>)
}

export default observer(App);