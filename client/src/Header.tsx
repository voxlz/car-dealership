import React, { useState, useEffect, useContext } from 'react';

interface Props {}

const Header: React.FC<Props> = props => {
  return (
    <header className='w-full h-16 bg-gray-100'>
      <div className='page-width flex flex-row place-content-between'>
        <h1 className='h-full font-bold text-4xl'>CarShop</h1>
        <div className='flex flex-row mt-2 cursor-pointer hover:underline text'>
          <div
            className='flex flex-col text-right 
            '>
            <p className='text-gray-600 text-sm'>logged in as:</p>
            <p className=''>torben.nordtorp@icloud.com</p>
          </div>
          <img
            src='/profile.png'
            className='w-12 h-12 ml-4 rounded-full hover:border-indigo-300 border-2'
            alt='default profile'
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
