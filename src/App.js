import React, {useEffect} from 'react';
import "./App.css"
import {useTelegram} from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import ProductList from "./components/ProductList/ProductList";

const App = () => {
    const {tg} = useTelegram()

    useEffect(() => {
        tg.ready()
    },[tg])

    return (
        <div>
            <Header />
            <ProductList />
        </div>
    );
};

export default App;