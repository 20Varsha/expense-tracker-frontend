import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { LOGIN } from '../../../helpers/backendHelpers';
import { APIClient } from '../../../helpers/apiHelpers';

const Signin1 = () => {
  const api = new APIClient();
  const history = useHistory();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      if (validateForm()) {
        const response = await api.create(LOGIN, formData);

        if (response.status === 'success') {
          localStorage.setItem('token', response.result.token); 
          history.push('/app/dashboard/default');
        } else {
          console.log('Login failed:', response.message);
        }
      } else {
        console.log('Form validation failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign In</h3>
                  <form onSubmit={handleSignIn}>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-control ${errors.email && 'is-invalid'}`}
                        placeholder="Email address"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="input-group mb-4">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`form-control ${errors.password && 'is-invalid'}`}
                        placeholder="Password"
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary mb-4">Sign In</button>
                  </form>
                  <p className="mb-2">
                    Don&apos;t have an account?
                    <NavLink to="/auth/signUp-1" className="f-w-400">
                      Sign Up
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
