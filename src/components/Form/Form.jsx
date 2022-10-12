import React, {useCallback, useState} from 'react';
import "./Form.css";
import axios from "axios";

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
        email: "",
        message: "",
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
                email: "",
                message: "",
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
                url: process.env.CONTACT_FORM_ENDPOINT,
                data: inputs
            }).then(_response => {
                handleServerResponse(
                    true,
                    "Thank you, your message has been submmitted."
                )
            })
        },
        [inputs, handleServerResponse]
    );

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