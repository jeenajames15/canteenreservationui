import React, { useState } from 'react';
import { Button, InputGroup } from '@blueprintjs/core';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

import validate from './loginValidation';
import useForm from './useForm';
import logo from '../Images/uel_logo';
import '../styles/login.css';

export default function Login() {
  const { values, errors, handleChange, handleSubmit } = useForm(
    login,
    validate
  );
  const [show, setShow] = useState(false);
  const [err, setErr] = useState([]);

  function login() {
    axios.post(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/login`, values).then((res) => {
      if (!res.data) {
        setErr({ msg: 'Invalid Credentials' });
        setShow(false)
      } else {
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('userName', res.data.firstName + ' ' + res.data.lastName);
        localStorage.setItem('userType', res.data.userType);
        setShow(true);
      }
    }).catch((error) => {
      setErr({ msg: 'Invalid Credentials' });
      setShow(false)
    });
  }
  if (!show) {
    return (
      <div className="login">
        <img style={{ width: '70px', marginTop: '20px' }} src={logo} />
        <h2 style={{ color: 'white' }}>
          UEL CANTEEN
        </h2>
        <form
          style={{ textAlign: 'left', color: 'white', width: '25%', margin: 'auto', display: 'flex', flexDirection: 'column' }}
          onSubmit={handleSubmit}>
          {err.msg && <p className="danger">{err.msg}</p>}
          <label className="label">Email Address</label>
          <InputGroup
            className="inputField"
            leftIcon="envelope"
            placeholder="Enter your email"
            name="email"
            onChange={handleChange}
          />
          {errors.email && <p className="danger">{errors.email}</p>}
          <label className="label">Password</label>
          <InputGroup
            className="inputField"
            leftIcon="lock"
            placeholder="Enter your password"
            name="password"
            onChange={handleChange}
            type="password"
          />
          {errors.password && <p className="danger">{errors.password}</p>}
          <Button
            className="submitBtn bp3-intent-success"
            type="submit"
            value="Login"
          >
            Login
          </Button>
        </form>
        <Link to="/register">
          <Button
            className="submitBtn bp3-intent-success"
            style={{ width: '25%', margin: '10px auto', display: 'flex' }}
          >
            Register
          </Button>
        </Link>
        <div className="im" style={{ margin: 'auto auto 0 0' }}>
        </div>
      </div>
    );
  } else {
    return <Redirect to="/menu" />;
  }
}
