import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, HTMLSelect } from '@blueprintjs/core';
import axios from 'axios';

import PlaceOrder from './PlaceOrder';
import NavBarUser from './NavBarUser';
import MenuBar from './MenuBar';
import '../styles/menu.css';

export default function Menu({ match }) {
  const [menu, setMenu] = useState([]);
  const [items, setItems] = useState([]);
  const [isShowOrderItem, setOrderItem] = useState(false);
  const [isShowFilter, setFilter] = useState(false);
  const [isShowRating, setRating] = useState(false);
  const [isSortValue, setSortValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setFeedRating] = useState(0);
  const [foodId, setFoodId] = useState(0);
  const [isFoodDes, setIsFoodDes] = useState(false);
  const [selectedIndex, setIndex] = useState(-1);

  const history = useHistory();

  const userType = localStorage.getItem('userType');

  const sortValue = ['Sort Price By Ascending Order', 'Sort Price By Descending Order',
    'Sort Preparation Time By Ascending Order', 'Sort Preparation Time By Descending Order',
    'Sort Calorie By Ascending Order', 'Sort Calorie By Descending Order']

  useEffect(() => {
    setOrderItem(false);
    axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/foods`).then((res) => {
      setMenu(res.data);
    });
  }, [items]);

  useEffect(() => {
    isSortValue === 'Sort Price By Ascending Order' && menu.sort((a, b) => Number(a.price) - Number(b.price));
    isSortValue === 'Sort Price By Descending Order' && menu.sort((a, b) => Number(b.price) - Number(a.price));
    isSortValue === 'Sort Preparation Time By Ascending Order' && menu.sort((a, b) => Number(a.preparationTime) - Number(b.preparationTime));
    isSortValue === 'Sort Preparation Time By Descending Order' && menu.sort((a, b) => Number(b.preparationTime) - Number(a.preparationTime));
    isSortValue === 'Sort Calorie By Ascending Order' && menu.sort((a, b) => Number(a.calorie) - Number(b.calorie));
    isSortValue === 'Sort Calorie By Descending Order' && menu.sort((a, b) => Number(b.calorie) - Number(a.calorie));
    setMenu(menu);
    setFilter(false);
  }, [isSortValue]);

  const deleteFood = (foodId) => {
    axios.delete(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/foods/${foodId}`).then((res) => {
      axios
        .get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/foods`)
        .then((res) => {
          setMenu(res.data);
        });
    })
  }

  const handleOrders = (i) => {
    const isPresent = items.some(food => food.foodId === i.foodId);
    if (!isPresent) {
      setItems([...items, { ...i, count: 1 }]);
    } else {
      const arr = [];
      items.map(food => {
        return food.foodId === i.foodId ? arr.push({ ...food, count: (food.count || 1) + 1 }) : arr.push(food)
      }
      );
      setItems(arr);
    };
  }

  const handleDelete = (orderItem) => {
    setItems(orderItem);
  };

  const handleClear = () => {
    setItems([]);
  };

  const submitFeedback = () => {
    const userName = localStorage.getItem('userName');
    const ratingValue = {
      rating: rating,
      userName,
      review: feedback,
      foodId: foodId
    }
    axios.post('http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/ratings', ratingValue).then((res) => {
      axios
        .get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/foods`)
        .then((res) => {
          setMenu(res.data);
        });
      setRating(false)
    });
  }

  const renderRating = (feedBackRatingValue) => {
    return <div class="star-rating-feedback">
      <span class={feedBackRatingValue >= 1 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
      <span class={feedBackRatingValue >= 2 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
      <span class={feedBackRatingValue >= 3 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
      <span class={feedBackRatingValue >= 4 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
      <span class={feedBackRatingValue >= 5 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
    </div>
  }

  const findPic = (image) => {
    return `https://canteenbucket.s3.eu-west-2.amazonaws.com/${image}`
  }

  return (
    <div style={{ height: '100%' }}>
      <NavBarUser view={true} />
      <div style={{ display: 'flex', height: '100%', position: 'absolute' }}>
        <MenuBar view={true} />
        <div style={{ width: '100%', background: 'white', margin: '1%', overflow: 'auto'}}>
          <div style={{ display: 'grid' }}>
            <div className='menuLabelStyle'>Menu</div>
            <div className={userType === 'admin' ? 'actionButton' : 'userActionButton'}>
              {localStorage.getItem('userType') === 'admin' && (<Button
                onClick={() => history.push("/add_dish")}
                className="submitBtn bp3-intent-danger"
                style={{ minWidth: '115px' }}
              >
                Add Dish
              </Button>)}

              <Button
                onClick={() => setFilter(!isShowFilter)}
                className="submitBtn bp3-intent-danger"
                style={{ minWidth: '115px' }}
              >
                Sort {!isShowFilter ? (<i className='upArrow'></i>) : (<i className='downArrow'></i>)}
              </Button>

              <Button
                onClick={() => setOrderItem(!isShowOrderItem)}
                className="submitBtn bp3-intent-danger"
                disabled={!items.length > 0}
                style={{ minWidth: '115px' }}
              >
                Order Items {!isShowOrderItem ? (<i className='upArrow'></i>) : (<i className='downArrow'></i>)}
              </Button>
            </div>
          </div>
          <div className='menuCardWrapper'>
            <div className='menuCardContainer'>
              {menu.map((item, index) => {
                return item.available ?
                  <div
                    style={{
                      margin: '10px auto 10px auto',
                      width: '100%',
                      textAlign: 'left',
                    }}
                    key={index}
                  >
                    <Card
                      style={{
                        alignItems: 'center',
                        padding: '0'
                      }}
                    >
                      <div style={{ gridColumn: '1/2' }}>
                        <div style={{ display: 'flex' }}>
                          {selectedIndex === index && isFoodDes ? <div style={{ width: '100%', height: '200px', padding: '15px' }}><p>
                            <b>Description : </b>
                            {item.foodDescription}
                          </p>
                            <p>
                              <b>Price :</b> {item.price}
                            </p>
                            <p>
                              <b>Type :</b> {item.foodClass}
                            </p>
                            <p>
                              <b>Preparation time :</b> {item.preparationTime}
                            </p>
                            <p>
                              <b>Calorie:</b> {item.calorie}
                            </p></div> : <img src={findPic(item.picName)} alt="no image" onClick={() => history.push({
                              pathname: '/Menu/rating',
                              state: { foodId: item.foodId }
                            })}
                              style={{ width: '100%', height: '200px' }} />}
                          <div style={{ zIndex: '2', marginLeft: '-8%' }}>
                            <Button
                              onMouseOver={() => { setIsFoodDes(!isFoodDes); setIndex(index) }}
                              onMouseOut={() => { setIsFoodDes(!isFoodDes); setIndex(0) }}>
                              <i className='fas fa-exclamation-circle'></i></Button></div>
                        </div>
                        <div className='menuRatingWrapper'><div className='menuRatingContainer'>
                          {item.foodName} {renderRating(Math.round(item.avgRating))}</div>
                          <div style={{ margin: '0 10px' }}><b>Price :</b> {item.price}</div>
                        </div>

                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridGap: '5px', padding: '10px' }}>
                        <Button
                          onClick={() => handleOrders(item)}
                          className="submitBtn bp3-intent-danger"
                        >
                          Add
                        </Button>
                        {localStorage.getItem('userType') === 'admin' && (<Button
                          onClick={() => history.push({
                            pathname: '/add_dish',
                            state: { data: menu[index] }
                          })}
                          className="submitBtn bp3-intent-danger"
                        >
                          Edit
                        </Button>)}
                        {localStorage.getItem('userType') === 'admin' && (<Button
                          onClick={() => deleteFood(menu[index].foodId)}
                          className="submitBtn bp3-intent-danger"
                        >
                          Delete
                        </Button>)}
                        {localStorage.getItem('userType') === 'user' && (<Button
                          onClick={() => { setRating(!isShowRating); setFoodId(item.foodId) }}
                          className="submitBtn bp3-intent-danger"
                        >
                          Feedback
                        </Button>)}
                      </div>
                    </Card>
                  </div>
                  : null
              })}
            </div>
            {items.length > 0 && isShowOrderItem && (
              <div style={{ position: 'absolute', right: '-40px', top: '40px', width: '25%', zIndex: '2' }}>
                <PlaceOrder
                  items={items}
                  handleDelete={handleDelete}
                  handleClear={handleClear}
                  style={{
                    gridColumn: '2/3',
                    textAlign: 'center',
                    overflowY: 'scroll',
                    height: '90vh',
                  }}
                />
              </div>)}
            {isShowFilter &&
              <div style={{
                position: 'absolute', right: '21%', top: '40px', width: '19%', background: 'white',
                boxShadow: '1px 1px #888888', zIndex: '2',
              }}>
                {sortValue.map((sortItem, index) => <div style={{
                  border: '1px solid black',
                  padding: '8px'
                }} key={index} onClick={() => {
                  setSortValue(sortItem);
                }}>{sortItem}</div>)}
              </div>}
          </div>
        </div>
      </div>
      {isShowRating && <div className='feedBackWrapper'>
        <div className='feedBackHeaderStyle'>Menu Feedback</div>
        <div style={{ width: '90%' }}>
          <div className='feedBackLabelWrapper'>
            <label className="label">Feedback: </label>
            <textarea
              className="inputField"
              placeholder="Enter Your Feedback"
              name="feedback"
              onChange={(e) => setFeedback(e.target.value)}
              value={feedback}
            />
          </div>
          <div className='feedBackLabelWrapper'>
            <label className="label">Rating: </label>
            <div class="star-rating">
              <input type="radio" id="5-stars" name="rating" value={rating} onClick={() => setFeedRating(5)} />
              <label for="5-stars" class="star">&#9733;</label>
              <input type="radio" id="4-stars" name="rating" value={rating} onClick={() => setFeedRating(4)} />
              <label for="4-stars" class="star">&#9733;</label>
              <input type="radio" id="3-stars" name="rating" value={rating} onClick={() => setFeedRating(3)} />
              <label for="3-stars" class="star">&#9733;</label>
              <input type="radio" id="2-stars" name="rating" value={rating} onClick={() => setFeedRating(2)} />
              <label for="2-stars" class="star">&#9733;</label>
              <input type="radio" id="1-star" name="rating" value={rating} onClick={() => setFeedRating(1)} />
              <label for="1-star" class="star">&#9733;</label>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <Button
            className="submitBtn bp3-intent-success"
            type="submit"
            value="Login"
            style={{ margin: '20px' }}
            onClick={() => setRating(false)}
          >
            Cancel
          </Button>

          <Button
            className="submitBtn bp3-intent-success"
            type="submit"
            value="Login"
            style={{ margin: '20px' }}
            onClick={submitFeedback}
          >
            Submit
          </Button>
        </div>
      </div>}
    </div>
  );

}
