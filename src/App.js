import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 1.8em;
  text-align: center;
  margin-bottom: 20px;
`;

const InputField = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
    width: 100%;
  padding: 10px;
  background-color: ${props => (props.disabled ? '#c0c0c0' : '#007bff')}; // Change background color when disabled
  color: ${props => (props.disabled ? '#7f7f7f' : 'white')}; // Change text color when disabled
  border: none;
  border-radius: 4px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')}; // Change cursor style

  &:hover {
    background-color: ${props => (props.disabled ? '#c0c0c0' : '#0056b3')}; // Change hover color when disabled
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  background-color: ${props => props.success ? '#28a745' : '#dc3545'};
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

function App() {
  const [formData, setFormData] = useState({
    orderId: '',
    orderLink: '',
    price: '',
    status: 'Pending'
  });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showSucessToast, setSucessToast] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastTimeout = useRef(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // If orderLink is imputed in the form we check if there is an order ID
    if (name === 'orderLink') {
      const orderIdMatch = value.match(/order\/(\d+)/);
      // Unccoment this line if you want to search if an URL starts with https:// or http:// and then has order/{numbers} also comment the line above this one
      // const orderIdMatch = value.match(/^(https?:\/\/.*\/order\/(\d+))/);
      if (orderIdMatch) {
        const orderId = orderIdMatch[1];
        // Unccoment this lie if you want to search if an URL starts with https:// or http:// and then has order/{numbers} also comment the line above this one
        // const orderId = orderIdMatch[2];
        setFormData((prevData) => ({
          ...prevData,
          orderId: orderId
        }));
        showNotification(`Order ${orderId} has been found`, true);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          orderId: ''
        }));
      }
    }
  };
 
  // Shows the toast notification
  const showNotification = (message, success = true) => {
    setToastMessage(message);
    setShowToast(false);
    setSucessToast(success);

    // Clear any existing timeout to avoid multiple toasts stacking
    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }

    setTimeout(() => {
      setShowToast(true);
      toastTimeout.current = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 100);// Small delay to restart the animation
  };

  // Validate the form to make sure all the form fields are not empty
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.orderId) tempErrors.orderId = 'Order ID cannot be empty';
    if (!formData.orderLink) tempErrors.orderLink = 'Order Link cannot be empty';
    if (!formData.price) tempErrors.price = 'Price cannot be empty';
    if (!formData.status) tempErrors.status = 'Status cannot be empty';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Imitate form submition and clear the form after submitting it
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      showNotification('Form submitted successfully', true);
      setTimeout(() => {
        setFormData({
          orderId: '',
          orderLink: '',
          price: '',
          status: 'Pending'
        });
        setErrors({});
        showNotification('Form cleared', true);
        setIsSubmitting(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      // Clear toast timeout when component is unmounted
      if (toastTimeout.current) {
        clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  return (
    <AppContainer>
      <FormContainer>
        <Title>Order Form</Title>
        <form onSubmit={handleSubmit}>
          <InputField>
            <Label>Order ID:</Label>
            <Input
              type="number"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              disabled
            />
            {errors.orderId && <ErrorText>{errors.orderId}</ErrorText>}
          </InputField>
          <InputField>
            <Label>Order Link:</Label>
            <Input
              type="text"
              name="orderLink"
              value={formData.orderLink}
              onChange={handleChange}
            />
            {errors.orderLink && <ErrorText>{errors.orderLink}</ErrorText>}
          </InputField>
          <InputField>
            <Label>Price:</Label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <ErrorText>{errors.price}</ErrorText>}
          </InputField>
          <InputField>
            <Label>Status:</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Completed">Completed</option>
            </Select>
            {errors.status && <ErrorText>{errors.status}</ErrorText>}
          </InputField>
          <Button type="submit" disabled={isSubmitting}>Submit</Button>
        </form>
      </FormContainer>
      {showToast && showSucessToast && <Toast success>{toastMessage}</Toast>}
      {showToast && !showSucessToast && <Toast>{toastMessage}</Toast>}
    </AppContainer>
  );
}

export default App;
