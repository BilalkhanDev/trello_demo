import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../common/input/Input';
import CustomButton from '../../common/button/Button';
import styles from './../auth.module.css';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../../services/userServices';

const SignUp = () => {
 const navigate=useNavigate()
const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

 const handleRegister = async (values, { resetForm }) => {

    try {
      await registerUser(values);
      toast.success('Registration successful')
      navigate('/login');
         resetForm();
    } catch (error) {
      toast.error(error?.message || "Internal Server Error")
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftImage}></div>
      <div className={styles.rightForm}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Create Your Account</h2>
          <Formik
            initialValues={{ email: '', password: '', confirmPassword:'', username:'' }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleRegister(values, actions)}
          >
            {({ handleChange, values, errors, touched }) => (
              <Form>
                <CustomInput
                  label="Name"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  status={touched.username && errors.username ? 'error' : ''}
                 
                />
                <CustomInput
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  status={touched.email && errors.email ? 'error' : ''}
                 
                />
                <CustomInput
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  status={touched.password && errors.password ? 'error' : ''}
                />
                 <CustomInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  status={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
                />
                <CustomButton htmlType="submit" variant="primary" block className="mt-4">
                  SignUp
                </CustomButton>
                <p className='mt-2'>Already have a account ? { " "} 
                    <Link  to={'/login'}>Login</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignUp
