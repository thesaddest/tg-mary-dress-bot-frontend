import React, {useCallback, useState} from 'react';
import "./Form.css";
import axios from "axios";
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    const {tg} = useTelegram();
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

    const onSendData = useCallback(() => {
        const data = {
            inputs
        }
        tg.sendData(JSON.stringify(data));

    }, [inputs, tg]);

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
            }).then(() => setTimeout(() => {onSendData()}, 2000))
        },
        [inputs, handleServerResponse, onSendData]
    );

    return (
        <div className={"form-wrapper"}>
            <div className={"form-container"}>
                {status.submitted ? "" : <h3 className={"text-title"}>Введите данные для заказа</h3>}
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
                            <div style={{textAlign: "center", marginTop: "2.5rem"}}>
                                <button
                                    type="submit"
                                    className="form-button"
                                >
                                    {!status.submitting
                                        ? !status.submitted
                                            ? "Submit"
                                            : "Submitted"
                                        : "Submitting..."}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Form;