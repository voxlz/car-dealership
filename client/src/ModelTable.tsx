import React, { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { ICarModel } from './Dashboard';

interface Props {
  models?: ICarModel[];
}

export const textStyle = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
} as React.CSSProperties;

const ModelTable: React.FC<Props> = props => {
  const [models, setModels] = useState(props.models);
  const [carModel, setCarModel] = useState<ICarModel>({} as ICarModel);
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [isValidBrand, setIsValidBrand] = useState(true);
  const [isValidModel, setIsValidModel] = useState(true);

  useEffect(() => {
    setModels(props.models);
  }, [props.models]);

  const handleAdd = (_e: React.MouseEvent<SVGElement, MouseEvent>) => {
    //console.log('model', carModel?.price);

    const validPrice = !isNaN(Number(carModel?.price));
    const validBrand = carModel.brand && carModel.brand !== '';
    const validModel = carModel.model && carModel.model !== '';

    setIsValidNumber(validPrice);
    setIsValidBrand(validBrand as boolean);
    setIsValidModel(validModel as boolean);

    if (validPrice && validBrand && validModel) {
      setCarModel({ ...carModel, ...{ price: String(Number(carModel?.price)) } });
      fetch('/carmodels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carModel),
      })
        .then(res => res.json())
        .then(obj => setModels(models?.concat(obj)))
        .catch(err => console.error(err));
      //setCarModel({} as ICarModel);
      setIsValidNumber(true);
      setIsValidModel(true);
      setIsValidModel(true);
    }
  };

  const handleRemove = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    fetch('/carmodels', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: e.currentTarget.id }),
    })
      .then(res => res.json())
      .then(obj => setModels(models?.filter(val => val._id !== obj._id)))
      .catch(err => console.error(err));
  };

  console.log(models);
  return (
    <div>
      <div className='md:pr-8 md:mr-8 md:border-r-2'>
        <div className='flex flex-row label w-10/12'>
          <p className='w-1/3'>brand</p>
          <p className='w-1/3'>model</p>
          <p className='w-1/3'>price</p>
        </div>

        {models?.map(model => (
          <>
            <div
              className={
                'flex flex-row px-1 text-base gap-4 hover:bg-gray-200 text-white hover:text-black hover:shadow-sm'
              }>
              <div className={'flex flex-row w-10/12 text-black align-middle h-full py-2'}>
                <div className='w-1/3'>
                  <p style={textStyle}>{model.brand}</p>
                </div>
                <div className='w-1/3'>
                  <p style={textStyle}>{model.model}</p>
                </div>
                <div className='w-1/3'>
                  <p style={textStyle}>{model.price} kr</p>
                </div>
              </div>
              <div className='w-7 cursor-pointer mx-auto'>
                <AiOutlineDelete
                  id={model._id}
                  onClick={handleRemove}
                  className='h-8 w-8 my-1 py-1 hover:bg-red-700 hover:text-white rounded-full hover:shadow-md'
                />
              </div>
            </div>
            <hr />
          </>
        ))}
        <div
          className='flex flex-row px-1 text-base gap-4 
          '>
          <div className='flex flex-row w-10/12 text-black align-middle h-full pt-2  '>
            <input
              value={carModel?.brand}
              onChange={e => setCarModel({ ...carModel, ...{ brand: e.currentTarget.value } })}
              className={'input w-1/3 mr-1  ' + (isValidBrand ? '' : ' focus:border-red-500 border-red-500')}
              placeholder='Brand'
            />
            <input
              value={carModel?.model}
              onChange={e => setCarModel({ ...carModel, ...{ model: e.currentTarget.value } })}
              placeholder='Model'
              className={'input w-1/3 mr-1  ' + (isValidModel ? '' : ' focus:border-red-500 border-red-500')}
            />
            <div className='w-1/3 f-row'>
              <input
                value={carModel?.price}
                onChange={e => setCarModel({ ...carModel, ...{ price: e.currentTarget.value } })}
                placeholder='Price'
                className={'input w-5/6 mr-1' + (isValidNumber ? '' : ' focus:border-red-500 border-red-500')}
              />
              <p className='mt-2'>kr</p>
            </div>
          </div>
          <div className=' w-7 cursor-pointer   mx-auto mt-2'>
            <AiOutlinePlus
              onClick={handleAdd}
              className='h-8 w-8 my-1 py-1 hover:bg-green-400 hover:text-white rounded-full hover:shadow-md'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTable;
