import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import AccessDenied from './components/AccessDenied';

import Access from './Authorization/Access';
import axios from 'axios';

const PrivateRoute = ({ component: Component, action }) => {
  const [perm, setPerm] = useState({ perm: [], show: false });
  useEffect(() => {
    
    // axios.get(`http://localhost:5000/role/`, config).then((res) => {
    //   console.log(res);
    //   axios
    //     .get(`http://localhost:5000/role/permissions/`, {
    //       params: { role: res.data.role },
    //     })
    //     .then((res) => {
    //       console.log(res.data);
    //       setPerm({ perm: res.data, show: true });
    //     });
    // });
  }, []);
  if (true) {
    return (
       <Component />
    );
  } else return <div>Loading</div>;
};

export default PrivateRoute;
