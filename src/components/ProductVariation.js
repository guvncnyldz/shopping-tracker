import { useState } from 'react';
import { Loading } from './Loading';
import { deleteProductVariation } from '../db/db';
import { customParseFloat } from '../utilites/float';
import { UnitEnum } from '../enums/UnityType';
export default function ProductVariation({ product, variation, onRemoved, onFavoriteChanged }) {
    const [isDeleting, setDeleting] = useState(false)

    const handleRemoveProduct = async (e, variationId) => {
        e.stopPropagation();

        setDeleting(true)
        const result = await deleteProductVariation(variationId);

        if (!result) {
            setDeleting(false)
            return
        }

        setDeleting(false)
        onRemoved(variationId)
    };

    const handleFavorite = (e) => {
        e.stopPropagation()
        onFavoriteChanged(variation.id)
    }

    const amountUnit = UnitEnum.find(unit => unit.id == product.amount_unit)
    const totalPrice = `${customParseFloat(variation.price)}₺/${variation.amount}${amountUnit.totalText}`
    const unitPrice = `${customParseFloat(parseFloat(variation.price) / parseFloat(variation.amount))}₺/${amountUnit.unitText}`

    return (

        <div key={variation.id} className="flex justify-between space-y-1 items-center text-sm">
            <div className='flex flex-row gap-2 items-center'>
                <button onClick={e => handleFavorite(e)}>
                    <img className="w-4 h-4" src={variation.is_favorite ? '/favorite_selected.png' : '/favorite_unselected.png'} alt="image" />
                </button>
                <div>
                    {variation.brand ? variation.brand + " | " : ""} {variation.location} | {totalPrice} | {unitPrice}
                </div>
            </div>
            <button
                onClick={(e) => handleRemoveProduct(e, variation.id)}
                className="bg-red-500 text-white w-6 px-2 py-1 rounded"
            >
                {isDeleting ? <Loading width={2} height={5} /> : "-"}
            </button>
        </div >
    )
}
