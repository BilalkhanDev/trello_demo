import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../common/input/Input';
import CustomButton from '../../common/button/Button';
import styles from './../auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userServices';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Login = () => {
  const navigate=useNavigate()
  const user=useSelector((state)=>state.user.user)
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6).required('Required'),
  });

  useEffect(()=>{
     if(user && user?._id){
      navigate("/dashboard")
     }
  },[user])
  const handleLogin = async (values, { resetForm }) => {

    try {
     const user= await loginUser(values);  
     if(user){
      toast.success('Login successful');
      resetForm(); 
      navigate('/dashboard');
     }
     
    } catch (error) {
      console.log(error, "EROR on PAGE")
      toast.error(error?.message || 'Internal Server Error');
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftImage}></div>
      <div className={styles.rightForm}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Login to Your Account</h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleLogin(values, actions)}
          >
            {({ handleChange, values, errors, touched }) => (
              <Form>
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
                <CustomButton htmlType="submit" variant="primary" block className="mt-4">
                  Login
                </CustomButton>
                <p className='mt-2'>Not a account ? { " "} 
                    <Link  to={'/signUp'}>SignUp</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login
