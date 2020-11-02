import React from 'react';
import { Link } from 'react-router-dom';
import { IUser } from './UserPortal';

interface Props {
  user?: IUser;
}

const Header: React.FC<Props> = ({ user }) => {
  console.log(user);

  return (
    <header className='w-full h-16 bg-gray-100 shadow-md'>
      <div className='page-width flex flex-row place-content-between'>
        <Link to='/' className='f-row hover:text-teal-500'>
          <h1 className='h-full font-bold text-4xl mt-1'>Car</h1>
          <h1 className='h-full font-bold text-4xl mt-1 text-teal-500'>S</h1>
          <h1 className='h-full font-bold text-4xl mt-1'>hop</h1>
        </Link>

        {!user ? (
          <Link to='/userPortal'>
            <div className='btn btn-secondary text-xl pt-1 h-10 mt-3 w-32'>User Portal</div>
          </Link>
        ) : (
          <Link to='/profile'>
            <div className='flex flex-row mt-2 cursor-pointer hover:underline text'>
              <div
                className='flex flex-col text-right 
            '>
                <p className='text-gray-600 text-sm'>logged in as:</p>
                <p className=''>{user.name}</p>
              </div>
              <img
                src='/profile.png'
                className='w-12 h-12 ml-4 rounded-full hover:border-indigo-300 border-2'
                alt='default profile'
              />
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
