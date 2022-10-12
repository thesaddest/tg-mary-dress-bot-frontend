import React, {useState} from 'react';
import "./ProductList.css"
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {getTotalPrice} from "../../utils/getTotalPrice";
import img1 from "../../assets/1.PNG"
import img2 from "../../assets/2.PNG"
import img3 from "../../assets/3.PNG"
import img4 from "../../assets/4.PNG"

const products = [
    {id: 1, title: "Кардиган", price: 60, description: "Бежевый", img: img1},
    {id: 2, title: "Кофта-топик", price: 60, description: "Черный, Zara", img: img2},
    {id: 3, title: "Свитер", price: 60, description: "Тёмно-серый, тёплый, Pull&Bear", img: img3},
    {id: 4, title: "Свитер", price: 60, description: "Серый, тёплый", img: img4}
]

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg} = useTelegram();

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={"list"}>
            {products.map((product) => (
                <ProductItem product={product} onAdd={onAdd} className={"item"} />
            ))}
        </div>
    );
};

export default ProductList;