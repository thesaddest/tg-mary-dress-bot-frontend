import React, {useCallback, useEffect, useState} from 'react';
import "./Form.css";
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    const [name, setName] = useState("");
    const [surName, setSurName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [instagram, setInstagram] = useState("");
    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            name,
            surName,
            telephone,
        }

        tg.sendData(JSON.stringify(data));
    }, [name, surName, telephone, tg]);

    useEffect(() => {
        tg.onEvent("mainButtonClicked", onSendData);
        return () => {
            tg.offEvent("mainButtonClicked", onSendData);
        }
    },[tg, onSendData]);

    useEffect(() => {
        tg.MainButton.setParams({
            text: "Отправить данные"
        });
    },[tg.MainButton]);

    useEffect(() => {
        if(!name || !surName || !telephone) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [name, surName, telephone, tg.MainButton]);

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeSurName = (e) => {
        setSurName(e.target.value);
    }

    const onChangeTelephone = (e) => {
        setTelephone(e.target.value);
    }

    const onChangeInstargam = (e) => {
        setInstagram(e.target.value);
    }

    return (
        <div className={"form-wrapper"}>
            <h3>Введите ваши данные</h3>
            <div className={"form-wrapper"}>
                <input
                    className={"input"}
                    type="text"
                    placeholder={"Имя"}
                    value={name}
                    onChange={onChangeName}
                />
                <input
                    className={"input"}
                    type="text"
                    placeholder={"Фамилия"}
                    value={surName}
                    onChange={onChangeSurName}
                />
                <input
                    className={"input"}
                    type="text"
                    placeholder={"Телефон (требуется для подтверждения заказа)"}
                    value={telephone}
                    onChange={onChangeTelephone}
                />
                <input
                    className={"input"}
                    type="text"
                    placeholder={"Instagram (опционально)"}
                    value={instagram}
                    onChange={onChangeInstargam}
                />
            </div>
        </div>
    );
};

export default Form;