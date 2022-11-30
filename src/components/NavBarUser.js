import React from 'react';
import { Button, Navbar } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

export default function NavBarUser({ view }) {
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div>
      <Navbar className="bp3-dark">
        <Navbar.Group style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <Navbar.Heading>UEL CANTEEN</Navbar.Heading>
            <Navbar.Divider />
          </div>
          {view ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>{localStorage.getItem('userName')}</div>
                <Link
                  to={`/login`}
                  style={{ textDecoration: 'none', color: '#f5f8fa' }}
                >
                  <Button
                    className="bp3-minimal"
                    icon="power"
                    text="Logout"
                    onClick={handleLogout}
                  />
                </Link>
              </div>
            </>
          ) : (
            <Link
              to={`/login`}
              style={{ textDecoration: 'none', color: '#f5f8fa' }}
            >
              <Button className="bp3-minimal" icon="power" text="Home" />
            </Link>
          )}
        </Navbar.Group>
      </Navbar>
    </div>
  );
}
