import React, { useEffect, useState } from 'react';
import './assets/main.css';
import Dashboard from './Dashboard';
import Header from './Header';

const App = () => {
  return (
    <div className='App w-screen h-screen bg-white'>
      <Header />
      <div id='userPortal' className='m-16 f-row  justify-items-center justify-center box-border'>
        <div className='f-col gap-2 pr-4 border-gray-200 border-r-2 h-auto w-64'>
          <h2 className='text-2xl text-teal-600 font-semibold'>Register</h2>
          <p className='label'>E-mail</p>
          <input className='input' type='email' />
          <p className='label'>Password </p>
          <input className='input' type='password' />
          <p className='label'>Name</p>
          <input className='input' />
          <div className='w-20 h-8 bg-teal-500 hover:bg-teal-600 text-white text-center pt-1 rounded-sm border-2 border-teal-600 self-end cursor-pointer mt-2'>
            Register
          </div>
        </div>
        <div className='f-col gap-2 ml-4 h-auto w-64'>
          <h2 className='text-2xl text-teal-600 font-semibold'>Login</h2>
          <p className='label'>E-mail</p>
          <input className='input' type='email' />
          <p className='label'>Password</p>
          <input className='input' type='password' />
          <p className='label'>Remember me</p>
          <input type='checkbox' />
          <div className='w-20 h-8 bg-teal-400 hover:bg-teal-500 text-white text-center pt-1 rounded-sm border-2 border-teal-500 self-end cursor-pointer mt-2'>
            Login
          </div>
        </div>
      </div>
      <Dashboard />
    </div>
  );
};

export default App;
