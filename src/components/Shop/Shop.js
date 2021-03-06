import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    const [cart, setCart] = useState([]);
    const [pages, setPages] = useState(0)
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const url =`http://localhost:5000/products?page=${page}&size=${size}`
        fetch(url)
            .then(res => res.json())
            .then(data => setProducts(data));
    }, [page,size]);

    useEffect(() => {
        fetch("http://localhost:5000/productCount")
            .then(res => res.json())
            .then(data => {
                const count = data.productCount;
                const page = Math.ceil(count / 10);
                setPages(page)
            })
    }, [])

    useEffect(() => {
        const storedCart = getStoredCart();
        const savedCart = [];
        for (const id in storedCart) {
            const addedProduct = products.find(product => product._id === id);
            if (addedProduct) {
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                savedCart.push(addedProduct);
            }
        }
        setCart(savedCart);
    }, [products])

    const handleAddToCart = (selectedProduct) => {
        console.log(selectedProduct);
        let newCart = [];
        const exists = cart.find(product => product._id === selectedProduct._id);
        if (!exists) {
            selectedProduct.quantity = 1;
            newCart = [...cart, selectedProduct];
        }
        else {
            const rest = cart.filter(product => product._id !== selectedProduct._id);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, exists];
        }
          console.log(setCart(newCart));
        setCart(newCart);
        addToDb(selectedProduct._id);
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link to="/orders">
                        <button>Review Order </button>
                    </Link>
                </Cart>
            </div>
            <div>
                <div className='pagination'>
                    {
                        [...Array(pages).keys()]
                            .map(number =>
                                <button className={page === number ? "selected" : ""} onClick={() => setPage(number)}>
                                    {number}
                                </button>)
                    }
                    <select onChange={(e) => setSize(e.target.value)}>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                    </select>

                </div>
            </div>
        </div>
    );
};

export default Shop;