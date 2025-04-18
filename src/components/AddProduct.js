import { useState, useEffect } from 'react';
import { UnitEnum } from '../enums/UnityType';
import { addProduct } from '../db/db';
import { Loading } from './Loading';
import { customParseFloat } from '../utilites/float';
export default function AddProduct({ onAdd }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState(UnitEnum[0].id);
  const [variations, setVariations] = useState([]);
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState();
  const [isLocationEmpty, setLocationEmpty] = useState(false)
  const [isAmountEmpty, setAmountEmpty] = useState(false)
  const [isPriceEmpty, setPriceEmpty] = useState(false)
  const [isNameEmpty, setNameEmpty] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const removeVariation = (selectedVariation) => {
    setVariations(variations.filter(v => !(v.price === selectedVariation.price && v.brand === selectedVariation.brand && v.location === selectedVariation.location)));
  };

  const addVariation = () => {
    setLocationEmpty(false)
    setPriceEmpty(false)
    setAmountEmpty(false)

    if (!location)
      setLocationEmpty(true)

    if (!price)
      setPriceEmpty(true)

    if (!amount || amount <= 0)
      setAmountEmpty(true)

    if (location && price && amount && amount > 0) {
      setVariations([...variations, { brand, location, amount, price: parseFloat(price).toFixed(2) }]);
      setBrand("");
      setLocation("");
      setAmount("");
      setPrice("");
    }
  };

  async function beginAddProduct() {
    setNameEmpty(false)

    if (!name)
      setNameEmpty(true)

    if (name) {
      setLoading(true)
      const result = await addProduct({ name, unit }, variations)

      if (!result) {
        setLoading(false)
        return;
      }

      setLoading(false)
      onAdd();
      setName("");
      setVariations([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-2">Ürün Ekle</h2>
      <div className="flex space-x-2 mb-2">
        <input className={`border p-1 rounded w-1/2 mb-2 ${isNameEmpty ? "border-red-600" : ""}`} placeholder="Ürün Adı" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="border p-1 rounded w-1/2 h-full" value={unit} onChange={(e) => setUnit(e.target.value)}>
          {UnitEnum.map((value) => (
            <option key={value.id} value={value.id}>{value.option}</option>
          ))}
        </select>
      </div>
      <h3 className="text-md font-semibold">Seçenek Ekle</h3>
      <div className='flex flex-col space-y-1 mb-2'>
        {variations.map(variation => {
          return (
            <div className='flex flex-row space-x-2'>
              <div className="border p-1 rounded w-1/4 truncate"  > {variation.brand} </div>
              <div className="border p-1 rounded w-1/4 truncate"  > {variation.location} </div>
              <div className="border p-1 rounded w-1/4 truncate"  > {variation.amount} </div>
              <div className="border p-1 rounded w-1/4 truncate"  > {customParseFloat(variation.price)} </div>
              <button onClick={() => removeVariation(variation)} className="bg-red-500 text-white w-8 px-2 py-1 rounded">-</button>
            </div>
          )
        })}
      </div>
      <div className="flex space-x-2 mb-2">
        <input className="border p-1 rounded w-1/3" placeholder="Marka" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input className={`border p-1 rounded w-1/3 ${isLocationEmpty ? "border-red-600" : ""}`} placeholder="Mekan" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input className={`border p-1 rounded w-1/3 ${isAmountEmpty ? "border-red-600" : ""}`} placeholder="Miktar" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className={`border p-1 rounded w-1/3 ${isPriceEmpty ? "border-red-600" : ""}`} placeholder="Fiyat" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button onClick={addVariation} className="bg-blue-500 text-white w-8 px-2 py-1 rounded">+</button>
      </div>
      {isLoading ? <button className="bg-green-500 text-white px-4 py-2 rounded w-full cursor-default"><Loading width={6} height={6} /></button> :
        <button onClick={beginAddProduct} className="bg-green-500 text-white px-4 py-2 rounded w-full">Ürün Ekle</button>
      }
    </div >
  );
}