import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, InputGroup } from '@blueprintjs/core';
import axios from 'axios';

import NavBarUser from './NavBarUser';
import MenuBar from './MenuBar';
import '../styles/viewCart.css'

export default function ViewCart({ match }) {
    const [isPayment, setPayment] = useState(false);
    const [menuList, setMenuList] = useState([]);
    const [account, setAccount] = useState('');
    const [cvv, setCvv] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [orderDetails, setOrderDetails] = useState({});
    const [isMessage, setMessage] = useState(false);

    const history = useHistory();

    useEffect(() => {
        setMenuList(history.location.state.data || [])
    }, [history]);

    useEffect(() => {
        setTimeout(() => {
            setMessage(false);
        }, 10000);
    });

    const submit = () => {
        setPayment(!isPayment);
        const totalPrice = menuList.reduce((total, item) => total + (item.price * (item.count ? item.count : 1)), 0);
        const totalPreparationTime = menuList.reduce((total, item) => total + item.preparationTime, 0);
        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        var values = {
            userName,
            userId,
            totalPrice,
            totalPreparationTime,
            menuItems: menuList,
            complete: false,
        };

        axios.post('http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/orders', values).then((res) => {
            setOrderDetails(res.data);
        });
    };

    const makePayment = () => {
        const totalPrice = menuList.reduce((total, item) => total + (item.price * (item.count ? item.count : 1)), 0);
        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');

        const payment = {
            orderId: orderDetails.orderId,
            userName: userName,
            userId: userId,
            cardNumber: account,
            amount: totalPrice,
        }
        axios.post('http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/transactions', payment).then((res) => {
            setPayment(false)
            setMessage(true);
            setMenuList([])
        });
    }

    const addItem = (item) => {
        const arr = [];
        menuList.map(food => {
            return food.foodId === item.foodId ? arr.push({ ...food, count: food.count + 1 }) : arr.push(food)
        }
        );
        setMenuList(arr)
    }

    const RemoveItem = (item) => {
        const arr = [];
        menuList.map(food => {
            return food.foodId === item.foodId ? arr.push({ ...food, count: food.count - 1 }) : arr.push(food)
        }
        );
        setMenuList(arr)
    }

    return (
        <div className='cartWarpper'>
            <NavBarUser view={true} />
            <div className='cartMenuWrapper'>
                <MenuBar view={true} />
                {menuList.length > 0 ? (<div style={{ width: '100%', background: 'white', margin: '1%', overflow: 'auto' }}>
                    <div className='cartLabel'>View Cart</div>
                    <div className='cartListWrapper' >
                        {menuList.map((item, index) => {
                            return item.count > 0 ?
                                <div className='cartCardWrapper' key={index}>
                                    <Card
                                        style={{
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div style={{ gridColumn: '1/2' }}>
                                            <h3 style={{ color: '#230444' }}>{item.foodName}</h3>
                                            <p>
                                                <b>Price :</b> {item.price}
                                            </p>
                                            <p>
                                                <b>Preparation time :</b> {item.preparationTime}
                                            </p>
                                            <p>
                                                <b>Count :</b> {item.count ? item.count : 1}
                                            </p>
                                        </div>
                                        <div className='cartButtonWrapper'>
                                            <Button
                                                onClick={() => addItem(item)}
                                                // className="bp3-intent-success"
                                                className="submitBtn bp3-intent-danger"
                                            >
                                                Add +
                                            </Button>
                                            <Button
                                                onClick={() => RemoveItem(item)}
                                                className="submitBtn bp3-intent-danger"
                                            >
                                                Remove -
                                            </Button>
                                        </div>

                                    </Card>
                                    <div style={{ display: 'flex', margin: '10px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Total Amount: </div>
                                        <label>{history.location.state.total}</label></div>
                                    <div style={{ display: 'flex', margin: '10px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Total Preparation Time:</div>
                                        <label>{history.location.state.time}</label></div>
                                    {(index === menuList.length - 1) && (
                                        <div className='cartDecisionButton'>
                                            <Button
                                                onClick={() => history.push('/menu')}
                                                className="submitBtn bp3-intent-danger"
                                                style={{ margin: '10px' }}
                                            >
                                                Cancel Order
                                            </Button>
                                            <Button
                                                onClick={submit}
                                                className="submitBtn bp3-intent-danger"
                                                style={{ margin: '10px' }}
                                            >
                                                Make Payment
                                            </Button>
                                        </div>)}
                                </div>
                                : <div className='noOrderStyle'>You haven't select any order. please go to Menu and select</div>

                        })}
                    </div>
                </div>) : (<div style={{ width: '100%', background: 'white', margin: '1%', overflow: 'auto' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '10% 0 1%' }}>
                        Your order is placed successfully!</div>
                    <button onClick={() => history.push('/menu')}>Go Back</button>
                </div>)}
            </div>
            {/* {isMessage &&
                <div style={{
                    right: '10px', top: '8%', position: 'absolute', height: '50px', border: '1px solid #d3d3d3',
                    width: '200px', background: 'white', display: 'flex', alignItems: 'center', paddingLeft: '6px',
                }}>
                    Your order is placed!
                    <button style={{
                        top: '0px',
                        position: 'absolute', right: '0',
                    }} type="button" class="close" aria-label="Close" onClick={() => setMessage(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button></div>} */}

            {isPayment && <div style={{
                position: 'absolute', background: 'white', zIndex: '2', width: '50%',
                height: '35%', top: '20%', right: '20%', left: '20%', border: '1px solid grey',
                boxShadow: 'grey 1px 1px', margin: 'auto'
            }}>
                <div style={{
                    padding: '10px', fontWeight: 'bold', fontSize: '15px',
                    borderBottom: '1px solid grey', background: 'rgb(49, 104, 106)',
                    color: 'white', marginBottom: '5px'
                }}>Make Payment</div>
                <div style={{ display: 'flex', margin: '10px', alignItems: 'center', }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Total Amount: </div>
                    <label>{history.location.state.total}</label></div>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <label style={{ marginRight: '10px', minWidth: '120px' }} >Card Number: </label>
                    <InputGroup
                        className="inputField"
                        placeholder="Enter Card Number"
                        name="account"
                        onChange={(e) => setAccount(e.target.value)}
                        value={account}
                        type='number'
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <label style={{ marginRight: '10px', minWidth: '120px' }} >Cvv Number: </label>
                    <InputGroup
                        className="inputField"
                        placeholder="Enter cvv Number"
                        name="cvv"
                        onChange={(e) => setCvv(e.target.value)}
                        value={cvv}
                        type='number'
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <label style={{ marginRight: '10px', minWidth: '120px' }} >Expiry Date : </label>
                    <input
                        placeholder="Enter Month"
                        name="date"
                        onChange={(e) => setMonth(e.target.value)}
                        value={month}
                        type='number'
                        style={{ width: '105px' }}
                    /><label>/</label>
                    <input
                        name="date"
                        placeholder="Enter Year"
                        onChange={(e) => setYear(e.target.value)}
                        value={year}
                        type='number'
                        style={{ width: '105px' }}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <Button
                        className="submitBtn bp3-intent-success"
                        type="submit"
                        value="Login"
                        style={{ margin: '20px' }}
                        onClick={() => setPayment(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="submitBtn bp3-intent-success"
                        type="submit"
                        value="Login"
                        style={{ margin: '20px' }}
                        onClick={makePayment}
                    >
                        Submit
                    </Button>
                </div>
            </div>}
        </div>
    );

}
