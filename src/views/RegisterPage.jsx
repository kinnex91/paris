// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import FormRegister from './FormRegister';


const API_BASE_URL = 'http://localhost:3007';

function LoginPage() {
 
    return (

          <FormRegister isSignup={true} />

      );
    }
export default LoginPage;
