import React, { useState, useEffect } from 'react';
import ModelTable, { textStyle } from './ModelTable';
import { ISale } from './Profile';

export interface ICarModel {
  _id: string;
  brand: string;
  model: string;
  price: string;
}

export interface IEmployee {
  name: string;
  sales: string;
}

const Dashboard: React.FC<{}> = () => {
  const [models, setModels] = useState<ICarModel[]>();
  const [employees, setEmployees] = useState<IEmployee[]>();
  const [sales, setSales] = useState<ISale[]>();

  useEffect(() => {
    fetch('/carmodels')
      .then(res => res.json())
      .then(obj => setModels(obj))
      .catch(err => console.error(err));
    fetch('/employees')
      .then(res => res.json())
      .then(obj => setEmployees(obj))
      .catch(err => console.error(err));
    fetch('/sales')
      .then(res => res.json())
      .then(obj => setSales(obj))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div id='dashBoard' className='page-width text-2xl flex flex-row flex-wrap'>
        <div className='md:w-2/3 w-full pr-4'>
          <h2 className='title'>Car Models</h2>
          <ModelTable models={models} />
        </div>
        <div className='md:w-1/3 w-full '>
          <h2 className='title'>Employees</h2>
          {employees?.map(employee => (
            <>
              <div className='flex flex-row  text-lg gap-4 hover:bg-gray-200  hover:shadow-md p-2 rounded-sm'>
                <img
                  src='/profile.png'
                  className='w-10 h-10 ml-4 rounded-full hover:border-indigo-300  border-2 '
                  alt='default profile'
                />
                <p className='w-auto mt-2' style={{ textOverflow: 'ellipsis' }}>
                  {employee.name}
                </p>
              </div>
            </>
          ))}
        </div>
        <div className='w-full my-8'>
          <h3 className='title text-center'>Sales</h3>

          <div className='flex flex-row label text-center'>
            <p className='w-1/4'>employee</p>
            <p className='w-1/4'>brand</p>
            <p className='w-1/4'>model</p>
            <p className='w-1/4'>price</p>
          </div>

          {sales?.map(sale => (
            <>
              <div
                className={
                  'flex flex-row px-1 text-base gap-4 hover:bg-gray-200 text-white hover:text-black hover:shadow-sm '
                }>
                <div className={'flex flex-row  text-black align-middle h-full py-2 w-full text-center'}>
                  <div className='w-1/4'>
                    <p style={textStyle}>{sale.employee.name}</p>
                  </div>
                  <div className='w-1/4'>
                    <p style={textStyle}>{sale.carmodel?.brand ?? 'error'}</p>
                  </div>
                  <div className='w-1/4'>
                    <p style={textStyle}>{sale.carmodel?.model ?? 'error'}</p>
                  </div>
                  <div className='w-1/4'>
                    <p style={textStyle}>{sale.carmodel?.price ?? 'error'} kr</p>
                  </div>
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
