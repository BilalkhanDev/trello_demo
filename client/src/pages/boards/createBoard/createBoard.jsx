// src/components/boards/BoardForm.jsx
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './Board.module.css';
import CustomButton from '../../../common/button/Button';
import CustomInput from '../../../common/input/Input';
import CustomSelect from '../../../common/select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../services/userServices';
import { setAllUser } from '../../../store/slices/userSlice';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  members: Yup.array(),
});

const BoardForm = ({ onClose, onSubmit, initialData = {} }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user?.allUsers || []);
  const [memberOptions, setMemberOptions] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await fetchUsers();
      if (response?.users) {
        dispatch(setAllUser(response.users));
      }
    };
    if (user?.role === 1) fetchAllUsers();
  }, [user]);

  useEffect(() => {
    if (users.length) {
      setMemberOptions(users.map(user => ({
        label: user?.email,
        value: user?._id,
      })));
    }
  }, [users]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: initialData?.title || '',
        description: initialData?.description || '',
        members: initialData?.members?.map(m => m._id || m.id || m) || [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values, action) => {

        const payload = initialData?._id ? { ...values, id: initialData._id } : values;
        onSubmit(payload);
        action.resetForm();
        onClose();
      }}
    >
      {({ handleChange, values, errors, touched, setFieldValue }) => (
        <Form className={styles.form}>
          <CustomInput
            label="Title"
            name="title"
            placeholder="Enter Board Title"
            value={values.title}
            onChange={handleChange}
            status={touched.title && errors.title ? 'error' : ''}
          />

          <CustomInput
            label="Description"
            name="description"
            placeholder="Enter Board Description"
            type="textarea"
            value={values.description}
            onChange={handleChange}
            status={touched.description && errors.description ? 'error' : ''}
          />

          <CustomSelect
            label="Members"
            name="members"
            placeholder="Assign Members"
            multiSelect
            value={values.members}
            onChange={(val) => {
              console.log('Members selected:', val); 
              setFieldValue('members', val);         
            }}
            options={memberOptions}
            error={touched.members && errors.members}
          />
          <div className={styles.buttonGroup}>
            <CustomButton htmlType="submit" variant="primary">
              {initialData?._id ? 'Update' : 'Create'}
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

export default BoardForm;
