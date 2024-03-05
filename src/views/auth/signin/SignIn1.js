import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const Signin1 = () => {
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
                  <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Email address" />
                  </div>
                  <div className="input-group mb-4">
                    <input type="password" className="form-control" placeholder="Password" />
                  </div>
                  <div className="form-check  text-start mb-4 mt-2">
                    <input type="checkbox" className="form-check-input" id="customCheck1" defaultChecked={false} />
                  </div>
                  <button className="btn btn-primary mb-4">Sign In</button>
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
