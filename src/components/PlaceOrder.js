import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Card } from '@blueprintjs/core';
import axios from 'axios';

export default function PlaceOrder(props) {
  var items = props.items;
  const [ordered, setOrdered] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [time, setTime] = useState(0);

  const history = useHistory();

  var item_ids = [],
    sum = 0;
  let prepTime = 0;

  useEffect(() => {
    setOrdered(items);
    setTotal(sum);
  }, []);

  props.items.map((i) => {
    sum += parseInt(i.price * (i.count ? i.count : 1));
  });

  useEffect(() => {
    prepTime = Math.max(...ordered.map(({ preparationTime }) => preparationTime))
    setTime(prepTime);
  }, [ordered]);


  const handleClick = (e) => {
    const orderItem = ordered.filter((order) => order.foodId !== e.foodId)
    setOrdered(orderItem);
    sum -= parseInt(e.price);
    setTotal(sum);
    props.handleDelete(orderItem);
  };

  const submit = () => {
    ordered.map((o) => item_ids.push(o.item_id));
    const totalPrice = ordered.reduce((total, item) => total + (item.price * (item.count ? item.count : 1)), 0);
    const totalPreparationTime = ordered.map(item => Math.max(item.preparationTime));
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    var values = {
      userName,
      userId,
      totalPrice,
      totalPreparationTime,
      menuItems: ordered,
      complete: false,
    };
    axios.post('http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/orders', values).then((res) => {
    });
    props.handleClear();
    setTotal(0);
    toggleOverlay();
  };

  const toggleOverlay = () => {
    setisOpen(!isOpen);
  };
  if (ordered.length != 0) {
    return (
      <div>
        {ordered.map((foodItem, index) => (
          <div key={`${foodItem.item_id}-${index}`}>
            <Card
              style={{
                height: '150px',
                width: '80%',
                display: 'grid',
                alignItems: 'center',
                gridTemplateColumns: '7fr 1fr'
              }}
            >
              <h3 style={{ gridColumn: '1/2',  margin: '0', textAlign: 'left'  }}>
                <div>Item: {foodItem.foodName}</div>
                <div>Price : {foodItem.price}</div>
                <div>Count : {foodItem.count ? foodItem.count : 1}</div>
              </h3>
              <Button
                icon="trash"
                className="bp3-intent-danger"
                onClick={() => handleClick(foodItem)}
                style={{ width: '50%', textAlign: 'right', padding: '5px' }}
              />
            </Card>
          </div>
        ))}
        <Card style={{ height: '150px', width: '80%', textAlign: 'left' }}>
          <h3>Total Price : {total}</h3>
          <h3>Total Preparation Time : {time}</h3>
          <div style={{display: 'grid', gridGap: '2%'}}>
          {/* <Button onClick={toggleOverlay}>Place Order</Button> */}
          <Button onClick={() => history.push({
            pathname: '/view_cart',
            state: { data: ordered, total, time}
          })}>View Cart</Button>
          </div>
        </Card>
        <Alert
          isOpen={isOpen}
          onConfirm={submit}
          onCancel={toggleOverlay}
          cancelButtonText={'Cancel'}
          confirmButtonText={'Confirm'}
          transitionDuration={3000}
        >
          Confirm Your Order
        </Alert>
      </div>
    );
  } else {
    return (
      <Card style={{ height: '100px', width: '80%' }}>
        <h3>Total Price : {total}</h3>
      </Card>
    );
  }
}
