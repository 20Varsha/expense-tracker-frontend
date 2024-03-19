import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import { ADD_INCOME, GET_INCOME, EDIT_INCOME, DELETE_INCOME } from '../../helpers/backendHelpers';
import { APIClient } from '../../helpers/apiHelpers';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Income = () => {
  const api = new APIClient();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    description: ''
  });
  const [editFormData, setEditFormData] = useState({
    id: '',
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
        toast.success("Income Added Successsfully")
        getIncome();
        setShowModal(false);
      } else {
        setValidated(true);
      }
    } catch (error) {
      toast.error("Error during income add")
      console.error('Error during income add:', error);
    }
  };

  const handleEditIncome = (item) => {
    setEditFormData(item);
    setShowEditModal(true);
  };

  const handleUpdateIncome = async () => {
    try {
      await api.update(`${EDIT_INCOME}/${editFormData._id}`, editFormData);
      toast.success("Income updated");
      getIncome();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Error updating income");
    }
  };

  const handleDeleteIncome = async () => {
    try {
      await api.delete(`${DELETE_INCOME}/${deleteItemId}`);
      toast.success("Income deleted");
      getIncome();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting income:', error);
      toast.error("Error deleting income");
    }
  };

  const handleShowDeleteModal = (itemId) => {
    setDeleteItemId(itemId);
    setShowDeleteModal(true);
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

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Add Income</Card.Title>
          </Card.Header>
        </Card>
      </Col>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="mb-4">
                <Col lg={4} >
                  <form className="app-search">
                    <div className="form-group">
                      <input type="search" placeholder="Search..." aria-describedby="button-addon" className="form-control bg-white" />
                    </div>
                  </form>
                </Col>
                <Col lg={8} className="d-flex align-items-end justify-content-end">
                  <Button className='w-25' onClick={() => setShowModal(true)} >
                    <FaPlus className='ml-2 mx-2' />Add Income
                  </Button>
                </Col>
              </Row>
              <Table responsive className="table-styling">
                <thead >
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Source</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
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
                      <td>
                        <FaEdit className='text-success' onClick={() => handleEditIncome(item)} />
                        <FaTrash className='text-danger mx-4' onClick={() => handleShowDeleteModal(item._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
          <Button variant="btn btn-white border" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddIncome}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Income Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Income</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="editIncomeForm" noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formEditAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter amount"
                name="amount"
                value={editFormData.amount}
                onChange={handleEditInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">Amount is required.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEditSource">
              <Form.Label>Source</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter source"
                name="source"
                value={editFormData.source}
                onChange={handleEditInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">Source is required.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEditDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-white border" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateIncome}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <FaExclamationTriangle className="text-danger mx-2 fs-2" />
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this income?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-white border" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteIncome}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </React.Fragment>
  );
};

export default Income;
