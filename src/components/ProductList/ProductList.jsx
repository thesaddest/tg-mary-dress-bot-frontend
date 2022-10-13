import React, {useState} from 'react';
import "./ProductList.css"
import ProductItem from "../ProductItem/ProductItem";
import Form from "../Form/Form";
import img1 from "../../assets/1.PNG";
import img2 from "../../assets/2.PNG";
import img3 from "../../assets/3.PNG";
import img4 from "../../assets/4.PNG";

const products = [
    {id: 1, title: "Cardigan", price: 60, description: "Beige, size: XS", img: img1},
    {id: 2, title: "Cropped sweater ZARA", price: 60, description: "Black, size XS", img: img2},
    {id: 3, title: "Sweater Pull&Bear", price: 60, description: "Warm, size XS", img: img3},
    {id: 4, title: "Gray sweater", price: 60, description: "Warm, size XS", img: img4}
]

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);
    }

    return (
        <>
            <div className={"list"}>
                {products.map((product) => (
                    <ProductItem key={product.id} product={product} onAdd={onAdd} className={"item"} />
                ))}
            </div>
            <Form addedItems={addedItems}/>
        </>

    );
};

export default ProductList;