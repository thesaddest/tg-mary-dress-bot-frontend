import React, {useState} from 'react';
import "./ProductItem.css";
import Button from "../Button/Button";

const ProductItem = ({product, className, onAdd}) => {
    const [isAdded, setIsAdded] = useState(false)

    const onAddHandler = () => {
        onAdd(product);
        setIsAdded(!isAdded);
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
                    <span>Price: <b>{product.price} zl</b></span>
                </div>
            </div>
            <button className={"add-btn"} onClick={onAddHandler}>{isAdded ? "Remove from order": "Add to an order"}</button>
        </div>
    );
};

export default ProductItem;