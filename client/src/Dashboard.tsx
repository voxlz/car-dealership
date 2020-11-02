import React, { useState, useEffect } from 'react';
import ModelTable from './ModelTable';

export interface ICarModel {
  _id: string;
  brand: string;
  model: string;
  price: string;
}

export interface IEmployee {
  name: string;
}

const Dashboard: React.FC<{}> = () => {
  const [models, setModels] = useState<ICarModel[]>();
  const [employees, setEmployees] = useState<IEmployee[]>();

  useEffect(() => {
    fetch('/carmodels')
      .then(res => res.json())
      .then(obj => setModels(obj))
      .catch(err => console.error(err));

    fetch('/employees')
      .then(res => res.json())
      .then(obj => setEmployees(obj))
      .catch(err => console.error(err));
  }, []);

  return (
    <div id='dashBoard' className='page-width text-2xl flex flex-row flex-wrap'>
      <div className='sm:w-2/3 w-full'>
        <ModelTable models={models} />
      </div>
      <div className='sm:w-1/3 w-full'>
        <h2 className='my-4'>Employees</h2>
        {employees?.map(employee => (
          <div className='flex flex-row m-2 text-lg gap-4'>
            <p className='w-full' style={{ textOverflow: 'ellipsis' }}>
              {employee.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
