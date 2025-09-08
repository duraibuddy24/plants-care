"use client"
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  dob: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

function calculateAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const RegistrationForm = () => {
  const [formStatus, setFormStatus] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            dob: '',
            gender: '',
            age: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={RegistrationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const age = calculateAge(values.dob);
            console.log({ body: JSON.stringify({ ...values, age })})
            try {
              const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, age }),
              });
              if (res.ok) {
                setFormStatus('Registration successful!');
                resetForm();
              } else {
                const data = await res.json();
                setFormStatus(data.error || 'Registration failed');
              }
            } catch (err) {
              setFormStatus('Registration failed');
            }
            setSubmitting(false);
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block mb-1">First Name</label>
                <Field name="firstName" className="w-full px-3 py-2 border rounded" />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block mb-1">Last Name</label>
                <Field name="lastName" className="w-full px-3 py-2 border rounded" />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block mb-1">Date of Birth</label>
                <Field
                  name="dob"
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  onChange={e => {
                    setFieldValue('dob', e.target.value);
                    setFieldValue('age', calculateAge(e.target.value));
                  }}
                />
                <ErrorMessage name="dob" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block mb-1">Gender</label>
                <div className="flex space-x-4">
                  <label>
                    <Field type="radio" name="gender" value="Male" /> Male
                  </label>
                  <label>
                    <Field type="radio" name="gender" value="Female" /> Female
                  </label>
                  <label>
                    <Field type="radio" name="gender" value="Other" /> Other
                  </label>
                </div>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block mb-1">Age</label>
                <Field
                  name="age"
                  className="w-full px-3 py-2 border rounded bg-gray-100"
                  value={values.age}
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <Field name="password" type="password" className="w-full px-3 py-2 border rounded" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block mb-1">Confirm Password</label>
                <Field name="confirmPassword" type="password" className="w-full px-3 py-2 border rounded" />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
              </div>
              <button
                type="submit"
                className="w-full py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
              {formStatus && <div className="text-center text-sm text-red-600 mt-2">{formStatus}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationForm;
