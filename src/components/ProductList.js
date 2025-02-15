import { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import { getProducts } from '../db/db';
import { Loading } from './Loading';
export default function ProductList() {
    const [products, setProduct] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [filterType, setFilterType] = useState(0)
    const [searchedName, setSearchedName] = useState("")

    useEffect(() => {
        getProductsBegin();
    }, []);

    async function handleFiltered(targetFilterType) {
        if (filterType == targetFilterType)
            return

        await getProductsBegin()
        setFilterType(targetFilterType)
    }

    async function getProductsBegin() {
        setLoading(true)
        const result = await getProducts()
        setProduct(result)
        setLoading(false)
    }

    const onProductRemoved = productId => {
        setProduct(products.filter(product => product.product_id != productId))
    }

    return (
        <div className="mt-4 space-y-2">
            <div className='flex flex-row gap-4'>
                <button
                    className={`flex justify-center items-center w-1/3 h-12 rounded shadow-md p-4 ${filterType == 0 ? "bg-blue-200" : "bg-white"}`}
                    onClick={() => { handleFiltered(0) }}>TÜM</button>
                <button
                    className={`flex justify-center items-center w-1/3 h-12 rounded shadow-md p-4 ${filterType == 1 ? "bg-blue-200" : "bg-white"}`}
                    onClick={() => handleFiltered(1)}>EVDEKİLER</button>
                <button
                    className={`flex justify-center items-center w-1/3 h-12 rounded shadow-md p-4 ${filterType == 2 ? "bg-blue-200" : "bg-white"}`}
                    onClick={() => handleFiltered(2)}>SEPETTEKİLER</button>
            </div>
            <div className='bg-white rounded shadow-md p-4'>
                <div className="flex w-full items-center">
                    <h2 className="text-lg font-semibold">Ürünler</h2>
                    <div className="w-1/4"></div>
                    <input className="border p-1 w-40 rounded" value={searchedName} placeholder='Ürün ara' onChange={e => setSearchedName(e.target.value)} />
                </div>
                {isLoading ? <Loading width={10} height={10} /> :
                    products.length === 0 ? (
                        <div className='text-center'>Ürün Bulunamadı</div>
                    ) : (
                        products
                            .filter(product =>
                                searchedName.trim() === "" ||
                                product.name.toLowerCase().includes(searchedName.toLowerCase())
                            ) 
                            .filter(product =>
                                filterType === 0 ||
                                (filterType === 1 && !product.is_required) ||
                                (filterType === 2 && product.is_required)
                            ) 
                            .map(product => (
                                <ProductItem
                                    key={product.product_id}
                                    productId={product.product_id}
                                    product={product}
                                    onProductRemoved={onProductRemoved}
                                />
                            ))
                    )
                }
            </div>
        </div >
    );
}