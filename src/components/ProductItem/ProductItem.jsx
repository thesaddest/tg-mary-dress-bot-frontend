import React from 'react';
import "./ProductItem.css";
import Button from "../Button/Button";

const ProductItem = ({product, className, onAdd}) => {

    const onAddHandler = () => {
        onAdd(product)
    }

    return (
        <div className={"product " + className}>
            <div className={"img-wrapper"}>
                <img className={"img"} src={product.img} alt="product"/>
            </div>
            <div className={"item-specs"}>
                <h3 className={"title"}>{product.title}</h3>
                <div className={"description"}>{product.description}</div>
                <div className={"price"}>
                    <span>Стоимость: <b>{product.price} zl</b></span>
                </div>
            </div>
            <Button className={"add-btn"} onClick={onAddHandler}>Добавить в корзину</Button>
        </div>
    );
};

export default ProductItem;