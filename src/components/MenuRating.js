import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import NavBarUser from './NavBarUser';
import MenuBar from './MenuBar';
import '../styles/menuRating.css';

export default function OrdersUser() {
    const [feedbacks, setFeedbacks] = useState([]);

    const history = useHistory();

    useEffect(() => {
        const menuId = history.location.state ? history.location.state.foodId : 0;
        axios.get(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/ratings/food/${menuId}`).then((res) => {
            setFeedbacks(res.data);
        });
    }, []);

  const renderRating = (feedBackRatingValue) => {
    return <div class="star-rating-feedback">
      <span class={feedBackRatingValue >= 1 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
      <span class={feedBackRatingValue >= 2 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
      <span class={feedBackRatingValue >= 3 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
      <span class={feedBackRatingValue >= 4 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
      <span class={feedBackRatingValue >= 5 ? "fa fa-star checked" : "fa fa-star not-checked"}></span>
    </div>
  }


    if (feedbacks.length !== 0) {
        return (
            <div style={{ height: '100%' }}>
                <NavBarUser view={true} />
                <div style={{ display: 'flex', height: '100%' }}>
                    <MenuBar view={true} />
                    <div style={{ width: '100%' }}>
                        <div className='menuHeaderWrapper'>
                            <div className='menuHeaderStyle'>Feedbacks</div>
                                {feedbacks.map((item, index) => {
                                    return <div className='menuBorderStyle'>
                                        <div className='menuCustomerWrapper'>
                                            <div><label style={{fontSize: '15px',fontWeight: 'bold',}}>Customer: </label>
                                            <label>{item.userName}</label></div>
                                            <div>{renderRating(Math.round(item.rating))}</div>
                                            </div>
                                            <div style={{textAlign: 'left', margin: '10px 0'}}>
                                            <label style={{fontSize: '15px',fontWeight: 'bold',}}>Date: </label>
                                            <label>{item.createDate}</label></div>
                                            <div style={{textAlign: 'left'}}>
                                            <label style={{fontSize: '15px',fontWeight: 'bold',}}>Feedback: </label>
                                            <label>{item.review}</label></div>
                                    </div>
                                })}
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
                            <div className='orderHeaderStyle'>FEEDBACKS</div>
                        </div>
                        <h1 style={{ marginTop: '15vh' }}>No Feedbacks</h1>
                    </div>
                </div>
            </div>
        );
    }
}
