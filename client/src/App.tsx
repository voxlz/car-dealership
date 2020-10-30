import React, { useEffect, useState } from 'react';
import './assets/main.css';

interface ICarModel {
  brand: String;
  model: String;
  price: number;
}

interface IEmployee {
  name: String;
}

interface ISales {
  employee_id: number;
  model_id: number;
}

function App() {
  const [models, setModels] = useState<ICarModel[]>();
  const [employees, setEmployees] = useState<IEmployee[]>();
  const [sales, setSales] = useState<ISales[]>();

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
    <div className='App w-screen h-screen bg-white'>
      <header className='w-full h-16 bg-gray-200'>
        <div className='w-4/6 m-auto  flex flex-row place-content-between'>
          <h1 className='h-full font-bold text-4xl'>CarShop</h1>
          <div className=' flex flex-row mt-2'>
            <div
              className=' flex flex-col text-right 
            '>
              <p className='text-gray-600 text-sm'>logged in as:</p>
              <p>torben.nordtorp@icloud.com</p>
            </div>
            <img
              src='https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
              className='w-12 h-12 ml-4 rounded-full'
              alt='default profile'
            />
          </div>
        </div>
      </header>
      <div id='dashBoard' className='w-4/6 m-auto text-2xl'>
        <h2>Car Models</h2>
        {models?.map(model => (
          <div className='flex flex-row w-2/3 m-2 text-lg gap-4'>
            <p className='w-1/3'>Brand: {model.brand}</p>
            <p className='w-1/3'>Model: {model.model}</p>
            <p className='w-1/3'>Price: {model.price}</p>
          </div>
        ))}
        <h2>Employees</h2>
        {employees?.map(employee => (
          <div className='flex flex-row w-2/3 m-2 text-lg gap-4'>
            <p className='w-full'>Name: {employee.name}</p>
          </div>
        ))}
        <h2>Sales</h2>
        {sales?.map(sale => (
          <div className='flex flex-row w-2/3 m-2 text-lg gap-4'>
            <p className='w-1/2'>Employee: {sale.employee_id}</p>
            <p className='w-1/2'>Car Model: {sale.model_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
