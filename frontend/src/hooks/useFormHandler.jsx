import { useState } from 'react';

const useFormHandler = (initialState, validate) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return { formData, handleChange, errors, validateForm };
};

export default useFormHandler;
