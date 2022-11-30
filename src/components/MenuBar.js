import React, {useState} from 'react';
import { Button, Navbar, Alignment } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import '../styles/menuBar.css'

export default function MenuBar({ view }) {
    const [width, setWidth]=useState(false);

    const changeWidth=()=>{
        setWidth(!width);
    }
  return (
      <div className={width ? 'menuBarSmallWrapper' : 'menuBarWrapper'}>
          {view && (
            <>
            <Button
                  icon="menu"
                  className="menuBarButtonStyle bp3-minimal"
                  onClick={()=> changeWidth()}
                />
            <Link
                to={`/Profile`}
                style={{ textDecoration: 'none', color: '#f5f8fa' }}
              >
                <Button
                  icon="user"
                  text={!width ? "Profile": ''}
                  className="bp3-minimal  menuBarButtonStyle"
                />
              </Link>
              <Link
                to={`/menu`}
                style={{ textDecoration: 'none', color: '#f5f8fa' }}
              >
                <Button
                  className="bp3-minimal menuBarButtonStyle"
                ><i className='fas fa-hamburger'></i>  {!width ? 'Menu': ''}</Button>
              </Link>
              <Link
                to={`/user/orders`}
                style={{ textDecoration: 'none', color: '#f5f8fa' }}
              >
                <Button
                  className="bp3-minimal menuBarButtonStyle"
                  icon="shopping-cart"
                  text={!width ? (localStorage.getItem('userType') === 'admin'? 'Order': "My Orders") : ''}
                />
              </Link>
              <Link
                to={`/transactions`}
                style={{ textDecoration: 'none', color: '#f5f8fa' }}
              >
                <Button
                  className="bp3-minimal  menuBarButtonStyle"
                ><i className='fas fa-dollar-sign'></i>  {!width ? 'Transactions': ''}</Button>
              </Link>
              {/* {localStorage.getItem('userType') === 'admin' && (
                <Link
                to={`/users`}
                style={{ textDecoration: 'none', color: '#f5f8fa' }}
              >
                <Button
                  className="bp3-minimal"
                  icon="user"
                  text={!width ? "users" : ''}
                  style={{ textDecoration: 'none' }}
                />
              </Link>
              )} */}
            </>
          )}
      </div>
  );
}
