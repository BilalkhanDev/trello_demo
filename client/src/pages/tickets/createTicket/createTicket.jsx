// src/components/tickets/TicketForm.jsx

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './TicketForm.module.css';
import CustomButton from '../../../common/button/Button';
import CustomInput from '../../../common/input/Input';
import CustomSelect from '../../../common/select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUsers } from '../../../services/userServices';
import { setAllUser } from '../../../store/slices/userSlice';

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string(),
  assignedTo: Yup.string(),
  priority: Yup.string(),
  status: Yup.string().required('Required'),
});


const priorityOptions = [
  { label: 'High', value: 2 },
  { label: 'Medium', value: 1 },
  { label: 'Low', value: 0 },
];

const statusOptions = [
  { label: 'Pending', value: 0 },
  { label: 'InProgress', value: 1 },
  { label: 'Completed', value: 2 },
];

const TicketForm = ({ onClose, onSubmit, initialData = {} }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch()
  const fetchAllUser = async () => {
    const response = await fetchUsers()
    if (response) {
      console.log(response)
      dispatch(setAllUser(response?.users))
    }
  }
  useEffect(() => {
    if (user && user?.role == 1) {
      fetchAllUser()
    }
  }, [])
  const users = useSelector((state) => state.user?.allUsers || []);
  const [assignedOptions, setAssignedOptions] = useState([]);
  useEffect(() => {
    if (users?.length) {
      const formatted = users?.map((user) => ({
        label: user?.email,
        value: user?._id,
      }));
      setAssignedOptions(formatted);
    }
  }, [users]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: initialData?.title || '',
        description: initialData?.description || '',
        assignedTo: initialData?.assignedTo?._id || initialData?.assignedTo?.id || '',
        status: typeof initialData?.status === 'number' ? initialData.status : Number(initialData?.status) || '',
        priority: typeof initialData?.priority === 'number' ? initialData.priority : Number(initialData?.priority) || '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, action) => {
        const payload = initialData?._id ? { ...values, id: initialData._id } : values;
        onSubmit(payload);
        action.resetForm();
        onClose();
      }}
    >
      {({ handleChange, values, errors, touched }) => (

        <Form className={styles.form}>
          <CustomInput
            label="Title"
            name="title"
            placeholder="Enter Title"
            value={values.title}
            onChange={handleChange}
            status={touched.title && errors.title ? 'error' : ''}
          />

          <CustomInput
            label="Description"
            name="description"
            placeholder="Enter Description"
            value={values.description}
            onChange={handleChange}
            type="textarea"
            status={touched.description && errors.description ? 'error' : ''}
          />

          <CustomSelect
            label="Assigned To"
            name="assignedTo"
            placeholder="Assigned To"
            value={values.assignedTo}
            onChange={handleChange}
            options={assignedOptions}
            error={touched.assignedTo && errors.assignedTo}
          />

          <CustomSelect
            label="Priority"
            name="priority"
            placeholder="Priority"
            value={values.priority}
            onChange={handleChange}
            options={priorityOptions}
            error={touched.priority && errors.priority}
          />

          <CustomSelect
            label="Status"
            name="status"
            placeholder="Status"
            value={values.status}
            onChange={handleChange}
            options={statusOptions}
            error={touched.status && errors.status}
          />

          <div className={styles.buttonGroup}>
            <CustomButton htmlType="submit" variant="primary">
              Submit
            </CustomButton>
            <CustomButton onClick={onClose} variant="secondary">
              Cancel
            </CustomButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TicketForm;
