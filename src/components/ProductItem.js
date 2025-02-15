import { useState, useEffect } from 'react';
import { UnitEnum } from '../enums/UnityType';
import { Loading } from './Loading';
import { deleteProduct, addProductVariation, updateProductRequired, updateVariationFavorite } from '../db/db';
import ProductVariation from './ProductVariation';
import { customParseFloat } from '../utilites/float';

export default function ProductItem({ productId, product, onProductRemoved }) {
    const [expanded, setExpanded] = useState(null);
    const [hasVariations, setHasVariations] = useState(false);
    const [cheapest, setCheapest] = useState({});
    const [newLocation, setNewLocation] = useState();
    const [newAmount, setNewAmount] = useState();
    const [newPrice, setNewPrice] = useState();
    const [newBrand, setNewBrand] = useState();
    const [isDeleting, setDeleting] = useState(false)
    const [variations, setVariations] = useState(product.variations)
    const [isLocationEmpty, setLocationEmpty] = useState(false)
    const [isPriceEmpty, setPriceEmpty] = useState(false)
    const [isAmountEmpty, setAmountEmpty] = useState(false)
    const [isAddingVariation, setAddingVariation] = useState(false)
    const [isRequired, setIsRequired] = useState(product.is_required);
    const [isRequiredLoading, setIsRequiredLoading] = useState(false)

    const handleProductRequired = async (e) => {
        e.stopPropagation()
        setIsRequiredLoading(true)

        const result = await updateProductRequired(productId, !isRequired)
        setIsRequiredLoading(false)

        if (!result) {
            return
        }

        setIsRequired(!isRequired)
    }
    const handleAddVariation = async (e) => {
        e.stopPropagation()
        setLocationEmpty(false)
        setAmountEmpty(false)
        setPriceEmpty(false)

        if (!newLocation)
            setLocationEmpty(true)

        if (!newPrice)
            setPriceEmpty(true)

        if (!newAmount || newAmount <= 0)
            setAmountEmpty(true)

        if (newLocation && newPrice && newAmount && newAmount > 0) {
            setAddingVariation(true)
            let newVariation = { brand: newBrand, location: newLocation, amount: newAmount, price: customParseFloat(newPrice) };
            const result = await addProductVariation(product.product_id, newVariation)
            setAddingVariation(false)

            if (!result) {
                return
            }

            newVariation.id = result.id
            setVariations([...variations, newVariation]);
            calculateCheapest()
        }
    };

    useEffect(() => {
        calculateCheapest()
        product.variations = variations
    }, [variations])

    function calculateCheapest() {
        setHasVariations(variations.length !== 0);
        if (variations.length !== 0) {
            const favoriteVariations = variations.filter(v => v.is_favorite);

            const availableVariations = favoriteVariations.length > 0 ? favoriteVariations : variations;

            setCheapest(availableVariations.reduce((prev, curr) =>
                (parseFloat(curr.price) / parseFloat(curr.amount) < parseFloat(prev.price) / parseFloat(prev.amount) ? curr : prev)
            ))
        }
    }
    const sortedVariations = variations.sort((a, b) => (parseFloat(a.price) / parseFloat(a.amount)) - (parseFloat(b.price) / parseFloat(b.amount)));

    const handleRemoveProduct = async (e, productId) => {
        e.stopPropagation();

        setDeleting(true)
        const result = await deleteProduct(productId);
        setDeleting(false)

        if (!result) {
            return
        }
        onProductRemoved(productId)
    };

    const onVariationRemoved = (variationId) => {
        setVariations(variations.filter(variation => variation.id !== variationId))
    };

    const handleFavorite = (variationId) => {
        const isFavorite = variations.find(variation => variation.id === variationId).is_favorite

        updateVariationFavorite(variationId, !isFavorite)
        setVariations(prevVariations =>
            prevVariations.map(variation =>
                variation.id === variationId
                    ? { ...variation, is_favorite: !isFavorite }
                    : variation
            )
        );
    }

    const amountUnit = UnitEnum.find(unit => unit.id == product.amount_unit)
    const totalPrice = `${customParseFloat(cheapest.price)}₺/${cheapest.amount}${amountUnit.totalText}`
    const unitPrice = `${customParseFloat(parseFloat(cheapest.price) / parseFloat(cheapest.amount))}₺/${amountUnit.unitText}`

    return (
        <div
            key={productId}
            className={`border-b py-2 cursor-pointer`}
            onClick={() => {
                setExpanded(expanded === productId ? null : productId);
            }}
        >
            <div className="flex justify-between items-center">
                <div className='flex flex-row items-center gap-2'>
                    <label onClick={(e) => {
                        handleProductRequired(e);
                    }} className={`cursor-pointer flex items-center justify-center w-6 h-6 rounded-full border border-gray-800 ${isRequired ? "bg-green-400" : "bg-white"}`}>
                        {isRequiredLoading ? <Loading width={6} height={6} /> : <></>}
                    </label>
                    <span>{product.name}</span>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    {hasVariations && (
                        <span className="text-sm text-gray-500">
                            {cheapest.brand ? cheapest.brand + " | " : ""} {cheapest.location} | {totalPrice} 
                        </span>
                    )}
                    <button
                        className={`bg-red-500 text-white w-6 px-1 py-1 rounded ${isDeleting ? 'cursor-default' : ''}`}
                        onClick={(e) => { if (!isDeleting) handleRemoveProduct(e, productId) }}
                    >
                        {isDeleting ? <Loading width={4} height={6} /> : "-"}
                    </button>
                </div>
            </div>

            {expanded === productId && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                    {sortedVariations.map((variation) => (
                        <ProductVariation onRemoved={onVariationRemoved} onFavoriteChanged={handleFavorite} product={product} variation={variation} />
                    ))}
                    <div className="flex space-x-2 mt-2">
                        <input
                            className="border p-1 rounded w-1/4"
                            placeholder="Marka"
                            value={newBrand}
                            onChange={e => setNewBrand(e.target.value)}
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        />
                        <input
                            className={`border p-1 rounded w-1/4 ${isLocationEmpty ? "border-red-600" : ""}`}
                            placeholder="Mekan"
                            value={newLocation}
                            onChange={e => setNewLocation(e.target.value)}
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        />
                        <input
                            className={`border p-1 rounded w-1/4 ${isLocationEmpty ? "border-red-600" : ""}`}
                            placeholder="Miktar"
                            type="number"
                            value={newAmount}
                            onChange={e => setNewAmount(e.target.value)}
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        />
                        <input
                            className={`border p-1 rounded w-1/4 ${isPriceEmpty ? "border-red-600" : ""}`}
                            placeholder="Fiyat"
                            type="number"
                            value={newPrice}
                            onChange={e => setNewPrice(e.target.value)}
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        />
                        <button
                            onClick={handleAddVariation}
                            className="bg-blue-500 text-white w-10 px-2 py-1 rounded"
                        >
                            {isAddingVariation ? <Loading width={5} height={6} /> : "+"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
