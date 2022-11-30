import React, { useEffect, useState } from 'react';
import { Button, InputGroup, HTMLSelect } from '@blueprintjs/core';
import axios from 'axios';

import NavBarUser from './NavBarUser';
import MenuBar from './MenuBar';
import '../styles/orderUser.css';

export default function OrdersUser() {
  const [orders, setOrders] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState('');
  const [item, setItem] = useState({});
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [tab, setTab] = useState('active')
  const [orderCompleteList, setOrderCompleteList] = useState([]);
  const [orderNonCompleteList, setOrderNonCompleteList] = useState([]);
  const [dummyCompleteList, setDummyCompleteList] = useState([]);
  const [dummyNonCompleteList, setDummyNonCompleteList] = useState([]);


  const type = localStorage.getItem('userType');

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    const userId = localStorage.getItem('userId');
    if (type === 'admin') {
      axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/orders`).then((res) => {
        setOrders(res.data);
        orderListFormat(res.data)
      });
    } else {
      axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/orders/users/${userId}`).then((res) => {
        setOrders(res.data);
        orderListFormat(res.data)
      });
    }
  };

  const userActiveTable = ['Serial Number', 'User Name', 'Food Order', 'Price', 'Date', 'Status', 'Preparation Time', 'Waiting Time'];
  const adminActiveTable = ['Serial Number', 'User Name', 'Food Order', 'Price', 'Date', 'Status', 'Preparation Time', 'Waiting Time', 'Action'];
  const userCompletedTable = ['Serial Number', 'User Name', 'Food Order', 'Price', 'Date', 'Status', 'Preparation Time'];

  const orderItem = (foodList) => {
    const list = [];
    foodList.menuItems.map(item => list.push(item.foodName));
    return list.join();
  }

  const waitingTime = (time, preparation) => {
    var date1 = new Date(time).getMinutes();
    var date2 = new Date().getMinutes();
    if (new Date(time).getDate() === new Date().getDate() && new Date(time).getHours() >= new Date().getHours()) {
    var timeDiff = Math.abs(date2 - date1);
    var waitingTime = preparation-timeDiff;
    } else {
      timeDiff = 0;
      waitingTime = 'delivered'
    }

    return waitingTime;
  }

  const sub = () => {
    const val = {
      userName: item.userName,
      userId: item.userName,
      totalPrice: item.totalPrice,
      totalPreparationTime: time,
      menuItems: item.menuItems,
      complete: status,
    };
    axios.put(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/orders/complete/${item.orderId}/${time}`).then((res) => {
      setEdit(false);
      axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/orders`).then((res) => {
        setOrders(res.data);
      });
    });
  };

  const onActiveFilterChange = (event) => {
    setName(event.target.value)
    if (event.target.value) {
      const list = dummyCompleteList.filter(item => item.userName.toLowerCase().includes(event.target.value) ||
        item.userName.toUpperCase().includes(event.target.value) || item.userName.includes(event.target.value)) || [];

        setOrderCompleteList(list)
    } else {
      setOrderCompleteList(dummyCompleteList)
    }
  }

  const onHistoryFilterChange = (event) => {
    setName(event.target.value)
    if (event.target.value) {
      const list = dummyNonCompleteList.filter(item => item.userName.toLowerCase().includes(event.target.value) ||
        item.userName.toUpperCase().includes(event.target.value) || item.userName.includes(event.target.value)) || [];

      setOrderNonCompleteList(list)
    } else {
      setOrderNonCompleteList(dummyNonCompleteList)
    }
  }

  const onActiveDateChange = (value) => {
    setDate(value);
    var dateFormat = new Date(value);
    const formatedDate = dateFormat.getDate() + '/' + (dateFormat.getMonth() + 1) + '/' + dateFormat.getFullYear();
    if (value) {
      const list = dummyCompleteList.filter(item => formatDate(item.createDate).includes(formatedDate)) || [];

      setOrderCompleteList(list)
    } else {
      setOrderCompleteList(dummyCompleteList)
    }
  }

  const onHistoryDateChange = (value) => {
    setDate(value);
    var dateFormat = new Date(value);
    const formatedDate = dateFormat.getDate() + '/' + (dateFormat.getMonth() + 1) + '/' + dateFormat.getFullYear();
    if (value) {
      const list = dummyNonCompleteList.filter(item => formatDate(item.createDate).includes(formatedDate)) || [];

      setOrderNonCompleteList(list)
    } else {
      setOrderNonCompleteList(dummyNonCompleteList)
    }
  }

  const formatDate = (dateValue) => {
    var dateFormat = new Date(dateValue);
    return dateFormat.getDate() + '/' + (dateFormat.getMonth() + 1) + '/' + dateFormat.getFullYear();
  }

  const orderListFormat = (list) => {
    let completeList = [];
    let nonCompleteList = [];

    list.map(item => item.complete && completeList.push(item));
    list.map(item => !item.complete && nonCompleteList.push(item));

    setOrderCompleteList(completeList);
    setDummyCompleteList(completeList)
    setOrderNonCompleteList(nonCompleteList);
    setDummyNonCompleteList(nonCompleteList);
  }

  if (orders.length !== 0) {
    return (
      <div style={{ height: '100%' }}>
        <NavBarUser view={true} />
        <div style={{ display: 'flex', height: '100%' }}>
          <MenuBar view={true} />
          <div style={{ width: '100%', background: 'white', margin: '1%' }}>
            <div className='ProfileWrapper'>
              <div className={tab === 'active' ? 'userSelectedTabWrapper' : 'userTabWrapper'}
                onClick={() => {setTab('active'); setDate('');setName('')}}>Active Order</div>
              <div className={tab === 'history' ? 'userSelectedTabWrapper' : 'userTabWrapper'}
                onClick={() => {setTab('history'); setDate('');setName('')}}>Order History</div>
            </div>

            {tab === 'active' && (
              <div style={{ marginTop: '10px' }}>
                <div className='orderHeaderWrapper'>
                  <div className='orderHeaderStyle'>Active ORDER</div>
                  <div style={{ display: 'flex' }}>
                    {localStorage.getItem('userType') === 'admin' && (<div className='filterInputWrapper'>
                      <label >Filter By Name : </label>
                      <InputGroup
                        className="inputField filterInputStyle"
                        placeholder="Enter name"
                        name="name"
                        value={name}
                        onChange={(e) => onHistoryFilterChange(e)}
                      />
                    </div>)}
                    <div className='filterInputWrapper'>
                      <label >Filter By Date : </label>
                      <input
                        className="inputField filterInputStyle"
                        placeholder="Enter date"
                        name="date"
                        value={date}
                        onChange={(e) => onHistoryDateChange(e.target.value)}
                        type='date'
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <table style={{ fontFamily: 'arial, sans-serif', borderCollapse: 'collapse', width: '98%', margin: '10px' }}>
                    <tr>
                      {localStorage.getItem('userType') === 'admin' ?
                        adminActiveTable.map(order => <th className='orderTableThStyle'>
                          {order}</th>) :
                        userActiveTable.map(order => <th className='orderTableThStyle'>
                          {order}</th>)}
                    </tr>
                    {orderNonCompleteList.map((item, index) => (
                      <tr>
                        <td className='orderTableThStyle'>{index + 1}</td>
                        <td className='orderTableThStyle'>{item.userName}</td>
                        <td className='orderTableThStyle'>{orderItem(item)}</td>
                        <td className='orderTableThStyle'>{item.totalPrice}</td>
                        <td className='orderTableThStyle'>{formatDate(item.createDate)}</td>
                        <th className='orderTableThStyle'>{item.complete ? 'Completed' : 'Not Completed'}</th>
                        <td className='orderTableThStyle'>{item.totalPreparationTime}</td>
                        <td className='orderTableThStyle'>{waitingTime(item.createDate, item.totalPreparationTime)}</td>
                        {type === 'admin' && <td className='orderTableThStyle'>
                          {item.complete ? null :
                            <Button
                              className="bp3-minimal"
                              icon="edit"
                              style={{ textDecoration: 'none' }}
                              onClick={() => { setEdit(!isEdit); setItem(item) }}
                            />
                          }</td>}
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            )}

            {tab === 'history' && (
              <div style={{ marginTop: '10px' }}>
                <div className='orderHeaderWrapper'>
                  <div className='orderHeaderStyle'>Order History</div>
                  <div style={{ display: 'flex' }}>
                    {localStorage.getItem('userType') === 'admin' && (<div className='filterInputWrapper'>
                      <label >Filter By Name : </label>
                      <InputGroup
                        className="inputField filterInputStyle"
                        placeholder="Enter name"
                        name="name"
                        value={name}
                        onChange={(e) => onActiveFilterChange(e)}
                      />
                    </div>)}
                    <div className='filterInputWrapper'>
                      <label >Filter By Date : </label>
                      <input
                        className="inputField filterInputStyle"
                        placeholder="Enter date"
                        name="date"
                        value={date}
                        onChange={(e) => onActiveDateChange(e.target.value)}
                        type='date'
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <table style={{ fontFamily: 'arial, sans-serif', borderCollapse: 'collapse', width: '98%', margin: '10px' }}>
                    <tr>
                      {userCompletedTable.map(order => <th className='orderTableThStyle'>
                        {order}</th>)}
                    </tr>
                    {orderCompleteList.map((item, index) => (
                      <tr>
                        <td className='orderTableThStyle'>{index + 1}</td>
                        <td className='orderTableThStyle'>{item.userName}</td>
                        <td className='orderTableThStyle'>{orderItem(item)}</td>
                        <td className='orderTableThStyle'>{item.totalPrice}</td>
                        <td className='orderTableThStyle'>{formatDate(item.createDate)}</td>
                        <th className='orderTableThStyle'>{item.complete ? 'Completed' : 'Not Completed'}</th>
                        <td className='orderTableThStyle'>{item.totalPreparationTime}</td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            )}


          </div>
          {isEdit &&
            <div className='orderEditWrapper'>
              <div className='orderEditHeaderStyle'>Edit Order</div>
              <div style={{ display: 'flex', alignItems: 'center', }}>
                <label style={{ marginRight: '10px', minWidth: '120px' }} className="label">Order Status : </label>

                <HTMLSelect
                  name="item_select"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option> Select Type</option>
                  <option value="complete"
                    selected={item.complete === 'complete'}>Complete</option>
                  <option value="not-complete"
                    selected={item.complete === 'not-complete'}>Not Complete</option>
                </HTMLSelect>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', }}>
                <label style={{ marginRight: '10px', minWidth: '120px' }} >Preparation Time : </label>
                <InputGroup
                  className="inputField"
                  placeholder="Enter Preparation Time"
                  name="time"
                  onChange={(e) => setTime(e.target.value)}
                  type="number"
                  value={time}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <Button
                  className="submitBtn bp3-intent-success"
                  type="submit"
                  value="Login"
                  style={{ margin: '20px' }}
                  onClick={() => setEdit(false)}
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
              <div className='orderHeaderStyle'>ORDERS</div>
              {localStorage.getItem('userType') === 'admin' && (<div className='filterInputWrapper'>
                <label >Filter By Name : </label>
                <InputGroup
                  className="inputField filterInputStyle"
                  placeholder="Enter name"
                  name="name"
                  value={name}
                  onChange={() => {}}
                />
              </div>)}
              <div className='filterInputWrapper'>
                <label >Filter By Date : </label>
                <input
                  className="inputField filterInputStyle"
                  placeholder="Enter date"
                  name="date"
                  value={date}
                  onChange={()=>{}}
                  type='date'
                />
              </div>
            </div>
            <h1 style={{ marginTop: '15vh' }}>No Orders</h1>
          </div>
        </div>
      </div>
    );
  }
}
