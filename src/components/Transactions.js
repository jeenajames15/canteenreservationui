import React, { useEffect, useState } from 'react';
import { Button, InputGroup, HTMLSelect } from '@blueprintjs/core';
import axios from 'axios';

import NavBarUser from './NavBarUser';
import MenuBar from './MenuBar';
import '../styles/orderUser.css';

export default function OrdersUser() {
    const [transactions, setTransactions] = useState([]);
    const [transactionsList, setTransactionsList] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    const type = localStorage.getItem('userType');

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        const userId = localStorage.getItem('userId');
        if (type === 'admin') {
            axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/transactions`).then((res) => {
                setTransactions(res.data);
                setTransactionsList(res.data);
            });
        } else {
            axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/transactions/user/${userId}`).then((res) => {
                setTransactions(res.data);
                setTransactionsList(res.data);
            });
        }
    };

    const userTable = ['Serial Number', 'User Name', 'Transaction Status', 'Amount', 'date'];
    const adminTable = ['Serial Number', 'User Name', 'Transaction Status', 'Amount', 'date'];

    const onFilterChange = (event) => {
        setName(event.target.value)
        if (event.target.value) {
            const list = transactionsList.filter(item => item.userName.toLowerCase().includes(event.target.value) ||
                item.userName.toUpperCase().includes(event.target.value) || item.userName.includes(event.target.value)) || [];

            setTransactions(list)
        } else {
            setTransactions(transactionsList)
        }
    }

    const onDateChange = (value) => {
        setDate(value);
        var dateFormat = new Date(value);
        const formatedDate = dateFormat.getDate() + '/' + (dateFormat.getMonth() + 1) + '/' + dateFormat.getFullYear();
        if (value) {
          const list = transactionsList.filter(item => formatDate(item.createDate).includes(formatedDate)) || [];
    
          setTransactions(list)
        } else {
            setTransactions(transactionsList)
        }
      }

    const formatDate = (date) => {
        var date = new Date(date);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    if (transactions.length !== 0) {
        return (
            <div style={{ height: '100%' }}>
                <NavBarUser view={true} />
                <div style={{ display: 'flex', height: '100%' }}>
                    <MenuBar view={true} />
                    <div style={{ width: '100%', background: 'white', margin: '1%' }}>
                        <div className='orderHeaderWrapper'>
                            <div className='orderHeaderStyle'>TRANSACTIONS</div>
                            <div style={{ display: 'flex' }}>
                            {localStorage.getItem('userType') ==='admin' &&( <div className='filterInputWrapper'>
                                    <label >Filter By Name : </label>
                                    <InputGroup
                                        className="inputField filterInputStyle"
                                        placeholder="Enter name"
                                        name="name"
                                        value={name}
                                        onChange={(e) => onFilterChange(e)}
                                    />
                                </div>)}
                                <div className='filterInputWrapper'>
                                    <label >Filter By Date : </label>
                                    <input
                                        className="inputField filterInputStyle"
                                        placeholder="Enter date"
                                        name="date"
                                        value={date}
                                        onChange={(e) => onDateChange(e.target.value)}
                                        type='date'
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <table style={{ fontFamily: 'arial, sans-serif', borderCollapse: 'collapse', width: '98%', margin: '10px' }}>
                                <tbody><tr>
                                    {type === 'admin' ?
                                        adminTable.map((order, index) => <th key={index} className='orderTableThStyle'>
                                            {order}</th>)
                                        : userTable.map((order, index) => <th key={index} className='orderTableThStyle'>
                                            {order}</th>)}
                                </tr>
                                    {transactions.map((item, index) => (
                                        <tr key={index}>
                                            <td className='orderTableThStyle'>{index + 1}</td>
                                            <td className='orderTableThStyle'>{item.userName}</td>
                                            <td className='orderTableThStyle'>completed</td>
                                            <th className='orderTableThStyle'>{item.amount}</th>
                                            <td className='orderTableThStyle'>{formatDate(item.createDate)}</td>
                                        </tr>
                                    ))}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ height: '100%' }}>
                <NavBarUser view={true} />
                <div style={{ display: 'flex', height: '100%' }}>
                    <MenuBar view={true} />
                    <div style={{ width: '100%' }}>
                        <div className='orderHeaderWrapper'>
                            <div className='orderHeaderStyle'>TRANSACTIONS</div>
                            {localStorage.getItem('userType') ==='admin' &&(<div className='filterInputWrapper'>
                                <label >Filter By Name : </label>
                                <InputGroup
                                    className="inputField filterInputStyle"
                                    placeholder="Enter name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => onFilterChange(e)}
                                />
                            </div>)}
                            <div className='filterInputWrapper'>
                                    <label >Filter By Date : </label>
                                    <input
                                        className="inputField filterInputStyle"
                                        placeholder="Enter date"
                                        name="date"
                                        value={date}
                                        onChange={(e) => onDateChange(e.target.value)}
                                        type='date'
                                    />
                                </div>
                        </div>
                        <h1 style={{ marginTop: '15vh' }}>No Transactions</h1>
                    </div>
                </div>
            </div>
        );
    }
}
