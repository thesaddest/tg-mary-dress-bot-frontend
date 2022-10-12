import React, {useCallback, useEffect, useState} from 'react';
import "./Form.css";
import axios from "axios";
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    // const [name, setName] = useState("");
    // const [surName, setSurName] = useState("");
    // const [telephone, setTelephone] = useState("");
    // const [instagram, setInstagram] = useState("");
    // const {tg} = useTelegram();
    //
    // const onSendData = useCallback(() => {
    //     const data = {
    //         name,
    //         surName,
    //         telephone,
    //     }
    //
    //     tg.sendData(JSON.stringify(data));
    // }, [name, surName, telephone, tg]);
    //
    // useEffect(() => {
    //     tg.onEvent("mainButtonClicked", onSendData);
    //     return () => {
    //         tg.offEvent("mainButtonClicked", onSendData);
    //     }
    // },[tg, onSendData]);
    //
    // useEffect(() => {
    //     tg.MainButton.setParams({
    //         text: "Отправить данные"
    //     });
    // },[tg.MainButton]);
    //
    // useEffect(() => {
    //     if(!name || !surName || !telephone) {
    //         tg.MainButton.hide();
    //     } else {
    //         tg.MainButton.show();
    //     }
    // }, [name, surName, telephone, tg.MainButton]);
    //
    // // const onChangeName = (e) => {
    // //     setName(e.target.value);
    // // }
    //
    // const onChangeSurName = (e) => {
    //     setSurName(e.target.value);
    // }
    //
    // const onChangeTelephone = (e) => {
    //     setTelephone(e.target.value);
    // }
    //
    // const onChangeInstargam = (e) => {
    //     setInstagram(e.target.value);
    // }

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: {
            error: false,
            msg: null,
        },
    });

    const [inputs, setInputs] = useState({
        customerName: "",
        telephone: "",
        item: "",
    });

    const handleOnChange = useCallback((e) => {
        e.persist();
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
        setStatus({
            submitted: false,
            submitting: false,
            info: {
                error: false,
                msg: null,
            },
        });
    }, []);

    const handleServerResponse = useCallback((ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: {
                    error: false,
                    msg,
                },
            });
            setInputs({
                customerName: "",
                telephone: "",
                item: "",
            });
        } else {
            setStatus({
                submitted: false,
                submitting: false,
                info: {
                    error: true,
                    msg,
                },
            });
        }
    }, []);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
            axios({
                method: 'POST',
                url: process.env.REACT_APP_CONTACT_FORM_ENDPOINT,
                data: inputs
            }).then(_response => {
                handleServerResponse(
                    true,
                    "Спасибо! Ваш заказ был успешно создан, скоро мы свяжемся с вами."
                )
            })
        },
        [inputs, handleServerResponse]
    );

    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            inputs
        }

        tg.sendData(JSON.stringify(data));
    }, [inputs, tg]);

    useEffect(() => {
        tg.onEvent("mainButtonClicked", onSendData, handleSubmit);
        return () => {
            tg.offEvent("mainButtonClicked", onSendData, handleSubmit);
        }
    },[tg, onSendData, handleSubmit]);

    useEffect(() => {
        tg.MainButton.setParams({
            text: "Отправить данные"
        });
    },[tg.MainButton]);

    useEffect(() => {
        if(!inputs) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [inputs, tg.MainButton]);

    return (
        <div className={"form-wrapper"}>
            <div className={"form-container"}>
                <h3 className={"text-title"}>Введите ваши данные</h3>
                <form className={"form"} onSubmit={handleSubmit}>
                    {status.info.error && (
                        <div role={"alert"} className={"error-form"}>
                            <strong>Ошибка</strong>
                            <span style={{display: "block",}}>{status.info.msg}</span>
                        </div>
                    )}
                    {status.submitted ? (
                        <div className={"submitted"} role={"alert"}>
                            Ваш заказ был успешно создан, скоро мы свяжемся с вами!
                        </div>
                    ) : (
                        <>
                            <input
                                id={"customerName"}
                                name={"customerName"}
                                maxLength={128}
                                required
                                className={"input"}
                                type="text"
                                placeholder={"Имя"}
                                value={inputs.customerName}
                                onChange={handleOnChange}
                            />
                            <input
                                id={"telephone"}
                                name={"telephone"}
                                maxLength={12}
                                required
                                className={"input"}
                                type="text"
                                placeholder={"Телефон"}
                                value={inputs.telephone}
                                onChange={handleOnChange}
                            />
                            <input
                                id={"item"}
                                name={"item"}
                                maxLength={128}
                                required
                                className={"input"}
                                type="text"
                                placeholder={"Название вещи"}
                                value={inputs.item}
                                onChange={handleOnChange}
                            />
                        </>
                    )}
                    {/*<input*/}
                    {/*    className={"input"}*/}
                    {/*    type="text"*/}
                    {/*    placeholder={"Фамилия"}*/}
                    {/*    value={surName}*/}
                    {/*    onChange={onChangeSurName}*/}
                    {/*/>*/}
                    {/*<input*/}
                    {/*    className={"input"}*/}
                    {/*    type="text"*/}
                    {/*    placeholder={"Телефон (требуется для подтверждения заказа)"}*/}
                    {/*    value={telephone}*/}
                    {/*    onChange={onChangeTelephone}*/}
                    {/*/>*/}
                    {/*<input*/}
                    {/*    className={"input"}*/}
                    {/*    type="text"*/}
                    {/*    placeholder={"Никнейм Instagram (опционально)"}*/}
                    {/*    value={instagram}*/}
                    {/*    onChange={onChangeInstargam}*/}
                    {/*/>*/}
                </form>
            </div>
        </div>
    );
};

export default Form;