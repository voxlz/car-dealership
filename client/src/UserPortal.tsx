import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  setUser: (usr: IUser | undefined) => void;
}

export interface IUser {
  _id: string;
  pass: string;
  email: string;
  name: string;
  employeeId?: string;
}

export interface ILogin {
  pass: string;
  email: string;
}

export interface IServerRes {
  success: boolean;
  value: string | IUser;
  emailExisted: boolean | undefined;
}

const UserPortal: React.FC<Props> = ({ setUser }) => {
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regName, setRegName] = useState('');
  const [logEmail, setLogEmail] = useState('');
  const [logPass, setLogPass] = useState('');
  const [logRemember, setLogRemember] = useState(true);
  const [logErr, setLogErr] = useState('');
  const [regErr, setRegErr] = useState('');
  const [logEmailIssue, setLogEmailIssue] = useState(false);
  const [regEmailIssue, setRegEmailIssue] = useState(false);
  const history = useHistory();

  const onLogin = () => {
    history.push('/profile');
  };

  const handleLog = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: logEmail, pass: logPass }),
    })
      .then(res => res.json())
      .then((res: IServerRes) => {
        if (res.success) {
          setUser(res.value as IUser);
          onLogin();
        } else {
          setLogErr(res.value as string);
          setLogEmailIssue(!res.emailExisted);
        }
      })
      .catch(err => console.error(err));
  };

  const handleReg = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regEmail, pass: regPass, name: regName }),
    })
      .then(res => res.json())
      .then((res: IServerRes) => {
        if (res.success) {
          setUser(res.value as IUser);
          onLogin();
        } else {
          setRegErr(res.value as string);
          setRegEmailIssue(res.emailExisted as boolean);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div id='userPortal' className='m-16 f-row  justify-items-center justify-center box-border'>
      <div className='f-col gap-2 pr-4 border-gray-200 border-r-2  h-auto w-64'>
        <h2 className='text-2xl text-teal-600 font-semibold'>Login</h2>
        <p className='label'>E-mail</p>
        <input
          className={'input' + (logErr !== '' && logEmailIssue ? ' border-red-700' : '')}
          type='email'
          value={logEmail}
          onChange={e => setLogEmail(e.currentTarget.value)}
        />
        <p className='label'>Password</p>
        <input
          className={'input' + (logErr !== '' && !logEmailIssue ? ' border-red-700' : '')}
          type='password'
          value={logPass}
          onChange={e => setLogPass(e.currentTarget.value)}
        />
        <p className='text-red-700'>{logErr}</p>
        <div className='f-row justify-between'>
          <div className='f-col gap-2'>
            <p className='label'>Remember me</p>
            <input
              type='checkbox'
              className='h-6 w-6 bg-teal-500'
              checked={logRemember}
              onChange={e => setLogRemember(e.currentTarget.checked)}
            />
          </div>
          <div className='btn btn-primary mt-4 ' onClick={handleLog}>
            Login
          </div>
        </div>
      </div>
      <div className='f-col gap-2 ml-4 h-auto w-64'>
        <h2 className='text-2xl text-teal-600 font-semibold'>Register</h2>
        <p className='label'>E-mail</p>
        <input
          className={'input' + (regErr !== '' && regEmailIssue ? ' border-red-700' : '')}
          type='email'
          value={regEmail}
          onChange={e => setRegEmail(e.currentTarget.value)}
        />
        <p className='label'>Password </p>
        <input
          className={'input' + (regErr !== '' && !regEmailIssue ? ' border-red-700' : '')}
          type='password'
          value={regPass}
          onChange={e => setRegPass(e.currentTarget.value)}
        />
        <p className='label'>Name</p>
        <input
          className='input'
          type='name'
          value={regName}
          onChange={e => setRegName(e.currentTarget.value)}
        />
        <p className='text-red-700'>{regErr}</p>
        <div className='btn btn-primary' onClick={handleReg}>
          Register
        </div>
      </div>
    </div>
  );
};

export default UserPortal;
