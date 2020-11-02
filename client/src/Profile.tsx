import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ICarModel, IEmployee } from './Dashboard';
import { textStyle } from './ModelTable';
import { IUser } from './UserPortal';

interface Props {
  user?: IUser;
  setUser: (usr: IUser | undefined) => void;
}

export interface ISale {
  id: number;
  employee_id: number;
  carmodel_id: number;
  employee: IEmployee;
  carmodel: ICarModel;
}

type IEmpSale = IEmployee & {
  _id: string;
  id: number;
  sales: number;
};

const Profile: React.FC<Props> = ({ user, setUser }) => {
  const [usrSales, setUsrSales] = useState<IEmpSale>();
  const [sales, setSales] = useState<ISale[]>();
  const history = useHistory();

  useEffect(() => {
    fetch('/sales')
      .then(res => res.json())
      .then((sales: ISale[]) => setSales(sales.filter(sale => sale.employee.name === user?.name)))
      .catch(err => console.error(err));
    fetch('/total_sales')
      .then(res => res.json())
      .then((employeeSales: IEmpSale[]) => setUsrSales(employeeSales.find(emp => emp.name === user?.name)))
      .catch(err => console.error(err));
  }, [user?.name]);

  return (
    <div id='profile' className='page-width mb-16'>
      {!user ? (
        <p className='f-col w-full items-center mt-32'>Please login to view your profile.</p>
      ) : (
        <>
          <div className='f-col w-full items-center mt-24'>
            <img
              src='/profile.png'
              className='w-48 h-48 ml-4 rounded-full hover:border-indigo-300 border-2'
              alt='default profile'
            />
            <p className='text-4xl'>{user?.name}</p>
            <p className='italic'>'work title'</p>
            <p
              className='btn btn-danger m-auto mt-8'
              onClick={() => {
                setUser(undefined);
                history.push('/userPortal');
              }}>
              Log-out
            </p>
          </div>
          <hr className='mt-8' />
          <div className='flex md:flex-row flex-col md:just'>
            <div className='mt-12 f-col items-center md:items-start w-full md:w-1/3 md:ml-auto'>
              <h3 className='text-xl font-bold text-teal-500 mb-4'>Contact information</h3>
              <p>Mail: {user?.email}</p>
              <p>Phone: +00-0000000</p>
            </div>
            <div className='mt-12 f-col items-center md:items-end w-full md:w-1/3 text-center md:text-right md:mr-auto'>
              <h3 className='text-xl font-bold text-teal-500 mb-4'>Employee status</h3>
              {!usrSales ? (
                <p>Your account is not associated with an employee at this company.</p>
              ) : (
                <div className=''>
                  <p>Employee ID: {usrSales?._id}</p>
                  <p>Total sales: {usrSales?.sales} kr</p>
                </div>
              )}
            </div>
          </div>

          {!usrSales ? (
            <></>
          ) : (
            <div className='w-2/3 m-auto my-8'>
              <h3 className='title text-center'>Sales</h3>

              <div className='flex flex-row label text-center'>
                <p className='w-1/3'>brand</p>
                <p className='w-1/3'>model</p>
                <p className='w-1/3'>price</p>
              </div>

              {sales?.map(sale => (
                <>
                  <div
                    className={
                      'flex flex-row px-1 text-base gap-4 hover:bg-gray-200 text-white hover:text-black hover:shadow-sm '
                    }>
                    <div className={'flex flex-row  text-black align-middle h-full py-2 w-full text-center'}>
                      <div className='w-1/3'>
                        <p style={textStyle}>{sale.carmodel.brand}</p>
                      </div>
                      <div className='w-1/3'>
                        <p style={textStyle}>{sale.carmodel.model}</p>
                      </div>
                      <div className='w-1/3'>
                        <p style={textStyle}>{sale.carmodel.price} kr</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                </>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
