import React, {useCallback, useEffect, useState} from 'react';
import "./Form.css";
import axios from "axios";
import {useTelegram} from "../../hooks/useTelegram";
import {getTotalPrice} from "../../utils/getTotalPrice";

const Form = ({addedItems}) => {
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
            inputs,
            totalPrice: getTotalPrice(addedItems)
        }
        tg.sendData(JSON.stringify(data));

    }, [inputs, tg, addedItems]);

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
            }).then(() => setTimeout(() => {onSendData()}, 1000))
        },
        [inputs, handleServerResponse, onSendData]
    );

    useEffect(() => {
        setInputs((prev) => ({
            ...prev,
            item: addedItems.map((addedItem) => addedItem.title + ` (${addedItem.price} zl)`),
        }));
    }, [addedItems]);

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
                                type="number"
                                placeholder={"Телефон(только цифры)"}
                                value={inputs.telephone}
                                onChange={handleOnChange}
                            />
                            <textarea
                                disabled
                                id={"item"}
                                name={"item"}
                                maxLength={128}
                                required
                                className={"form-textarea"}
                                placeholder={"Выберите вещи из католога сверху"}
                                value={inputs.item}
                            />

                            <div style={{textAlign: "center", marginTop: "1rem"}}>
                                <h3 style={{marginBottom: "1rem"}}>Total price: {getTotalPrice(addedItems)} zl</h3>
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