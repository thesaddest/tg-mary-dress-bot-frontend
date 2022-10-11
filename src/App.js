import React, {useEffect} from 'react';
import "./App.css"
import {useTelegram} from "./hooks/useTelegram";
import Header from "./components/Header/Header";

const App = () => {
    const {onToggleButton, tg} = useTelegram()

    useEffect(() => {
        tg.ready()
    },[tg])

    return (
        <div>
            <Header />
            <button onClick={onToggleButton}>TOGGLE</button>
        </div>
    );
};

export default App;