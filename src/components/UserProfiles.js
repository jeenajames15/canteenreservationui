import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
    Button,
    InputGroup,
    HTMLSelect,
} from '@blueprintjs/core';

import NavBarUser from './NavBarUser';
import MenuBar from './MenuBar'
import '../styles/userProfile.css'

export default function UserProfile() {
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newContact, setNewContact] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [tab, setTab] = useState('profile');
    const [allUsers, setUsers] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/users/${userId}`).then((res) => {
            setEmail(res.data.email);
            setAddress(res.data.address);
            setContact(res.data.phone);
            setUserDetails(res.data)
        })
    }, []);
    const sub = () => {
        const val = {
            ...userDetails,
            email: newEmail,
            phone: newContact,
            address: newAddress,
        };
        const userId = localStorage.getItem('userId');
        axios.put(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/users/${userId}`, val).then((res) => {
            axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/users/${userId}`).then((res) => {
                setEmail(res.data.email);
                setAddress(res.data.address);
                setContact(res.data.phone);
                setUserDetails(res.data)
            })
            setIsEdit(false);
        })
    };

    const changeTab = (tab) => {
        setTab(tab)
        if (tab === 'users' && allUsers.length === 0) {
            axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/users`).then((res) => {
                setUsers(res.data)
            });
        }
    }

    const userProfile = ['Serial Number', 'User Name', 'Email', 'Contact Number', 'Address'];

    const onEditOrder = () => {
        setIsEdit(!isEdit)
        setNewEmail(email)
        setNewAddress(address)
        setNewContact(contact)
    }

    return (
        <div style={{ height: '100%' }}>
            <NavBarUser view={true} />
            <div style={{ display: 'flex', height: '100%' }}>
                <MenuBar view={true} />
                <div style={{ width: '100%' }}>
                    {localStorage.getItem('userType') === 'admin' && (<div className='ProfileWrapper'>
                        <div className={tab === 'profile' ? 'userSelectedTabWrapper' : 'userTabWrapper'}
                            onClick={() => changeTab('profile')}>My Profile</div>
                        <div className={tab === 'users' ? 'userSelectedTabWrapper' : 'userTabWrapper'}
                            onClick={() => changeTab('users')}>All Users</div>
                    </div>)}
                    {tab === 'profile' ? (<div className='myProfileWrapper'>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}> My Profile</div>
                        <div className='profileDetails'>
                            <div style={{ textAlign: 'left' }}>
                                <div className='profileLabelWrapper'><label className='profileLabelStyle'>Email: </label>
                                    <span>{email}</span></div>
                                <div className='profileLabelWrapper'><label className='profileLabelStyle'>Contact Number: </label>
                                    <span>{contact}</span></div>
                                <div className='profileLabelWrapper'><label className='profileLabelStyle'>Address: </label>
                                    <span>{address}</span></div>
                            </div>
                            <Button
                                icon='edit'
                                className='editProfileButton'
                                onClick={() => onEditOrder()}
                            />
                        </div>
                    </div>) : (<div style={{ background: 'white', margin: '10px', padding: '30px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 10px', textAlign: 'left' }}> All Users</div>
                        <table style={{ fontFamily: 'arial, sans-serif', borderCollapse: 'collapse', width: '98%', margin: 'auto' }}>
                            <tr>
                                {userProfile.map((order, index) => <th key={index} className='profileTableTh'>
                                    {order}</th>)}
                            </tr>
                            {allUsers.map((item, index) => (
                                <tr key={index}>
                                    <td className='profileTableTh'>{index}</td>
                                    <td className='profileTableTh'>{item.firstName} {item.lastName}</td>
                                    <td className='profileTableTh'>{item.email}</td>
                                    <th className='profileTableTh'>{item.phone}</th>
                                    <td className='profileTableTh'>{item.address}</td>
                                </tr>
                            ))}
                        </table>
                    </div>)}
                </div>
            </div>
            {isEdit && <div className='profileEditWrapper'>
                <div className='profileEditHeaderStyle'>Edit Profile</div>
                <div>
                    <div className='profileFieldWrapper'>
                        <label style={{ marginRight: '10px', minWidth: '120px' }} >Email : </label>
                        <InputGroup
                            className="inputField"
                            placeholder="Enter Email"
                            name="email"
                            onChange={(e) => setNewEmail(e.target.value)}
                            value={newEmail}
                        />
                    </div>
                    <div className='profileFieldWrapper'>
                        <label style={{ marginRight: '10px', minWidth: '120px' }} >Phone Number : </label>
                        <InputGroup
                            className="inputField"
                            placeholder="Enter Contact Number"
                            name="contact"
                            onChange={(e) => setNewContact(e.target.value)}
                            type="number"
                            value={newContact}
                        />
                    </div>
                    <div className='profileFieldWrapper'>
                        <label style={{ marginRight: '10px', minWidth: '120px' }} >Address : </label>
                        <textarea
                            className="inputField"
                            placeholder="Enter Address"
                            name="address"
                            onChange={(e) => setNewAddress(e.target.value)}
                            value={newAddress}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <Button
                        className="submitBtn bp3-intent-success"
                        type="submit"
                        value="Login"
                        style={{ margin: '20px' }}
                        onClick={() => setIsEdit(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="submitBtn bp3-intent-success"
                        type="submit"
                        value="Login"
                        style={{ margin: '20px' }}
                        onClick={sub}
                    >
                        Submit
                    </Button>
                </div>
            </div>}
        </div>
    );
}
