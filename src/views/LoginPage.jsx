// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import FormRegister from './FormRegister';




function LoginPage() {
 
    return (

          <FormRegister isSignup={false}  urlPost='/auth/login' />

      );
    }
export default LoginPage;
