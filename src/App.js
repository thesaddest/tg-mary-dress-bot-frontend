import React, {useEffect} from 'react';
import "./App.css"
import {useTelegram} from "./hooks/useTelegram";

const App = () => {
    const {onToggleButton, tg} = useTelegram()


    useEffect(() => {
        tg.ready()
    },[])

    return (
        <div>
            APP
            <button onClick={onToggleButton}>TOGGLE</button>
        </div>
    );
};

export default App;