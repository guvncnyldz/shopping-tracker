import { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import { getProducts } from '../db/db';
import { Loading } from './Loading';
export default function ProductList() {
    const [products, setProduct] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [filterType, setFilterType] = useState(0)

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
                    onClick={() => { handleFiltered(0) }}>TÜM ÜRÜNLER</button>
                <button
                    className={`flex justify-center items-center w-1/3 h-12 rounded shadow-md p-4 ${filterType == 1 ? "bg-blue-200" : "bg-white"}`}
                    onClick={() => handleFiltered(1)}>EVDEKİLER</button>
                <button
                    className={`flex justify-center items-center w-1/3 h-12 rounded shadow-md p-4 ${filterType == 2 ? "bg-blue-200" : "bg-white"}`}
                    onClick={() => handleFiltered(2)}>SEPETTEKİLER</button>
            </div>
            <div className='bg-white rounded shadow-md p-4'>
                <h2 className="text-lg font-semibold mb-2">Ürünler</h2>
                {isLoading ? <Loading width={10} height={10} /> :
                    products.length == 0 ? <div className='text-center'>Ürün Bulunamadı</div> :
                        products.map((product) => {
                            if (filterType == 0 || (filterType == 1 && !product.is_required) || (filterType == 2 && product.is_required))
                                return (<ProductItem productId={product.product_id} product={product} onProductRemoved={onProductRemoved} />)
                        })
                }
            </div>
        </div >
    );
}