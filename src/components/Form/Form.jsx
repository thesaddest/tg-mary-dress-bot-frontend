import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./Form.css";
import axios from "axios";
import {useTelegram} from "../../hooks/useTelegram";
import {getTotalPrice} from "../../utils/getTotalPrice";

const Form = ({addedItems}) => {
    const {tg} = useTelegram();
    const inputNameRef = useRef(null);
    const inputTelephoneRef = useRef(null);
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

    const handleFocus = (ref) => {
        setTimeout(() => {
            ref.current.scrollIntoView({block:"center", behavior: "smooth"});
        }, 100)
    }

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
                    "??????????????! ?????? ?????????? ?????? ?????????????? ????????????, ?????????? ???? ???????????????? ?? ????????."
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
                {status.submitted ? "" : <h3 className={"text-title"}>Enter your data for an order</h3>}
                <form className={"form"} onSubmit={handleSubmit}>
                    {status.info.error && (
                        <div role={"alert"} className={"error-form"}>
                            <strong>Error</strong>
                            <span style={{display: "block",}}>{status.info.msg}</span>
                        </div>
                    )}
                    {status.submitted ? (
                        <div className={"submitted"} role={"alert"}>
                            Your order was successfully created, we will contact you soon!
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
                                placeholder={"Name"}
                                ref={inputNameRef}
                                value={inputs.customerName}
                                onChange={handleOnChange}
                                onClick={() => handleFocus(inputNameRef)}
                            />
                            <input
                                id={"telephone"}
                                name={"telephone"}
                                maxLength={15}
                                required
                                className={"input"}
                                type="text"
                                placeholder={"Telephone"}
                                ref={inputTelephoneRef}
                                value={inputs.telephone}
                                onChange={handleOnChange}
                                onClick={() => handleFocus(inputTelephoneRef)}
                            />
                            <textarea
                                disabled
                                id={"item"}
                                name={"item"}
                                maxLength={128}
                                required
                                className={"form-textarea"}
                                placeholder={"Choose an item from catalog"}
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