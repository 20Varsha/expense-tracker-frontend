import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { REGISTER } from '../../../helpers/backendHelpers';
import { APIClient } from '../../../helpers/apiHelpers';

const SignUp1 = () => {
  const api = new APIClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    try {
      setSubmitAttempted(true);

      if (validateForm()) {
        const response = await api.create(REGISTER, formData);
        console.log('Registration response:', response);
      } else {
        console.log(api.create(REGISTER));
        console.log('Form validation failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
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
            <Card.Body>
              <Row className="align-items-center">
                <Col className="col-12 d-flex justify-content-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                </Col>
                <Col className="col-12 d-flex justify-content-center">
                  <h3 className="mb-4">Sign up</h3>
                </Col>
              </Row>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className={`form-control ${submitAttempted && errors.name ? 'is-invalid' : ''}`}
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {submitAttempted && errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className={`form-control ${submitAttempted && errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {submitAttempted && errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="input-group mb-4">
                <input
                  type="password"
                  className={`form-control ${submitAttempted && errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {submitAttempted && errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <div className="input-group mb-4">
                <input
                  type="password"
                  className={`form-control ${submitAttempted && errors.confirm_password ? 'is-invalid' : ''}`}
                  placeholder="Re-type Password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
                {submitAttempted && errors.confirm_password && (
                  <div className="invalid-feedback">{errors.confirm_password}</div>
                )}
              </div>
              <button className="btn btn-primary mb-4 d-flex justify-content-center" onClick={handleSignUp}>
                Sign Up
              </button>
              <p className="mb-2">
                Already have an account?{' '}
                <NavLink to="/auth/signin-1" className="f-w-400">
                  Login
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
