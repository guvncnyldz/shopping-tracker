import { useState } from 'react';
import { Loading } from './Loading';
import { deleteProductVariation } from '../db/db';

export default function ProductVariation({variation, onRemoved }) {
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

    return (
        <div key={variation.id} className="flex justify-between space-y-1 items-center text-sm">
            <span>{variation.brand ? variation.brand + " - " : ""} {variation.location} - {parseFloat(variation.price).toFixed(2)}₺</span>
            <button
                onClick={(e) => handleRemoveProduct(e,variation.id)}
                className="bg-red-500 text-white w-6 px-2 py-1 rounded"
            >
                {isDeleting ? <Loading width={2} height={5} /> : "-"}
            </button>
        </div>
    )
}
