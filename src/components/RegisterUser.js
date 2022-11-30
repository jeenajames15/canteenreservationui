import React, { useState } from 'react';
import { Button, InputGroup } from '@blueprintjs/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import validate from './registerValidation';
import useForm from './useForm';
import logo from '../Images/uel_logo';
import '../styles/login.css';

export default function RegisterUser() {
  const { values, errors, handleChange, handleSubmit } = useForm(
    register,
    validate
  );
  const [emailErr, setemailErr] = useState({});
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState('Which is your first pet?');
  function register() {
    const dataSet = { ...values, securityQuestion: question, userType: 'user' };
    axios.post(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/user`, dataSet).then((res) => {
      if (res.data.msg === 'email already registered') {
        setemailErr({ msg: 'Email already registered' });
      } else {
        setShow(true);
      }
    });
  };
  const handleDropDownChange = (e) => {
    setQuestion(e.target.value);
  };
  if (!show) {
    return (
      <div className="login" onSubmit={handleSubmit}>
        <img style={{ width: '70px',marginTop: '20px'}} src={logo} />
        <h2 style={{ color: 'white' }}>
          UEL CANTEEN
        </h2>
        <form style={{
          textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '2%', width: '65%',
          margin: 'auto', color: 'white'
        }}>
          {emailErr.msg && <p className="danger">{emailErr.msg}</p>}
          <div>
            <label className="label">First Name</label>
            <InputGroup
              className="inputField"
              placeholder="Enter Your First Name"
              name="firstName"
              onChange={handleChange}
            />
            {errors.first_name && <p className="danger">{errors.first_name}</p>}
            <label className="label">Email Address</label>
            <InputGroup
              className="inputField"
              placeholder="Enter your email"
              name="email"
              onChange={handleChange}
            />
            {errors.email && <p className="danger">{errors.email}</p>}
          </div>
          <div>
            <label className="label">Last Name</label>
            <InputGroup
              className="inputField"
              placeholder="Enter Your Last Name"
              name="lastName"
              onChange={handleChange}
            />
            {errors.last_name && <p className="danger">{errors.last_name}</p>}
            <label className="label">Phone Number</label>
            <InputGroup
              className="inputField"
              placeholder="Enter Your Name"
              name="phone"
              onChange={handleChange}
              type="number"
            />
            {errors.phone_num && <p className="danger">{errors.phone_num}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <InputGroup
              className="inputField"
              placeholder="Enter Your password"
              name="password"
              onChange={handleChange}
              type="password"
            />
            {errors.password && <p className="danger">{errors.password}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gridColumnStart: '1' }}>
              <label className="label">Address</label>
              <textarea
                className="inputField"
                placeholder="Enter your address"
                name="address"
                onChange={handleChange}
              />
            </div>
            {errors.address && <p className="danger">{errors.address}</p>}
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <InputGroup
              className="inputField"
              placeholder="Enter Your password"
              name="confirm_password"
              onChange={handleChange}
              type="password"
            />
            {errors.confirm_password && <p className="danger">{errors.confirm_password}</p>}
          </div>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="label">Security Question</label>
              <select style={{ padding: '1%' }} name="question" id="question" onChange={handleDropDownChange}>
                <option value="Which is your first pet?">Which is your first pet?</option>
                <option value="what is your mother's name?">what is your mother's name?</option>
                <option value="What is your first school?">What is your first school?</option>
                <option value="Who is your favourite teacher?">Who is your favourite teacher?</option>
              </select>
            </div>
            <div style={{ margin: '10px 0 10px 0' }}>
              <label className="label">Answer</label>
              <InputGroup
                className="inputField"
                placeholder="Enter Your Security Answer"
                name="securityAnswer"
                onChange={handleChange}
              />
              {errors.securityAnswer && <p className="danger">{errors.securityAnswer}</p>}
            </div>
          </div>
          <div style={{ gridColumnStart: '1', gridColumnEnd: '3', textAlign: 'center', display: 'flex'}}>
            <Button
              className="registerBtn bp3-intent-success"
              type="submit"
              value="Register"
              style={{margin: '10px'}}
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              className="registerBtn bp3-intent-success"
              type="submit"
              value="Register"
              style={{margin: '10px'}}
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
}
