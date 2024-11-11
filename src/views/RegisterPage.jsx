// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import FormRegister from './FormRegister';



function LoginPage() {
 
    return (
         
             <FormRegister isSignup={true}   urlPost='/auth/register'  />

      );
    }
export default LoginPage;
