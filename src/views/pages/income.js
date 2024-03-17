import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import { ADD_INCOME, GET_INCOME } from '../../helpers/backendHelpers';
import { APIClient } from '../../helpers/apiHelpers';
import { NavLink, useHistory } from 'react-router-dom';

const Income = () => {
  const api = new APIClient();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    description: ''
  });
  const [incomeData, setIncomeData] = useState([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    getIncome();
  }, []);

  const handleAddIncome = async () => {
    try {
      const form = document.getElementById('incomeForm');
      if (form.checkValidity() && validateForm()) {
        await api.create(ADD_INCOME, formData);
        getIncome();
        setShowModal(false); // Close the modal after adding income
      } else {
        console.log('Form validation failed');
        setValidated(true);
      }
    } catch (error) {
      console.error('Error during income add:', error);
    }
  };

  const validateForm = () => {
    return formData.source && formData.amount && formData.description;
  };

  const getIncome = async () => {
    try {
      const response = await api.get(GET_INCOME);
      if (Array.isArray(response && response?.data)) {
        setIncomeData(response?.data);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error('Error retrieving income:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <React.Fragment>
      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Add Income</Card.Title>
          </Card.Header>
          <Card.Body>
            <Button onClick={() => setShowModal(true)}>Add Income</Button>
          </Card.Body>
        </Card>
      </Col>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table responsive className="table-styling">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Source</th>
                    <th>Description</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(incomeData) && incomeData.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.amount}</td>
                      <td>{item.source}</td>
                      <td>{item.description}</td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Income Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Income</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="incomeForm" noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="text" placeholder="Enter amount" name="amount" value={formData.amount} onChange={handleInputChange} required />
              <Form.Control.Feedback type="invalid">Please provide the amount.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSource">
              <Form.Label>Source</Form.Label>
              <Form.Control type="text" placeholder="Enter source" name="source" value={formData.source} onChange={handleInputChange} required />
              <Form.Control.Feedback type="invalid">Please provide the source.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Enter description" name="description" value={formData.description} onChange={handleInputChange} required />
              <Form.Control.Feedback type="invalid">Please provide the description.</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddIncome}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Income;
