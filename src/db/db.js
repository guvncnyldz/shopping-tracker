import { neon } from '@neondatabase/serverless';
import { getAuth } from './auth';

var bcrypt = require('bcryptjs-react');
const sql = neon(process.env.REACT_APP_DATABASE_URL);

export async function login(username, password) {
    try {
        const data = await sql`SELECT * FROM users where username=${username};`;

        if (data.length == 0)
            return null;

        const result = bcrypt.compareSync(password, data[0].password)

        if (!result)
            return null;

        return data[0];
    }
    catch (error) {
        console.error('Login', error);
        return null
    }
}

export async function getProducts() {
    try {
        const user = getAuth()

        if (!user)
            return []

        const result = await sql`
            SELECT 
                p.id AS product_id, 
                p.name, 
                p.amount, 
                p.amount_unit,
                p.is_required,
                COALESCE(
                    JSON_AGG(
                        JSONB_BUILD_OBJECT(
                            'id', pv.id,
                            'brand', pv.brand,
                            'location', pv.location,
                            'price', pv.price
                             )
                         ) FILTER (WHERE pv.id IS NOT NULL), '[]'
                    ) AS variations
                FROM products p
                LEFT JOIN product_variations pv ON p.id = pv.product_id
                WHERE p.home_id = ${user.home_id}
                GROUP BY p.id
        `;

        return result;

    } catch (error) {
        console.error('Error fetching products and variations:', error);
        return [];
    }
}

export async function deleteProduct(productId) {
    try {
        const user = getAuth();
        
        if (!user)
            return false;

        await sql`
            DELETE FROM products
            WHERE id = ${productId} AND home_id = ${user.home_id}`;

        return true;
    } catch (error) {
        console.error('Error deleting product and variations:', error);
        return false;
    }
}

export async function deleteProductVariation(variationId) {
    try {
        const user = getAuth();

        if (!user)
            return false;

        await sql`
            DELETE FROM product_variations
            WHERE id = ${variationId}`;

        return true;
    } catch (error) {
        console.error('Error deleting product and variations:', error);
        return false;
    }
}

export async function addProduct(product, variations) {
    try {
        const user = getAuth()

        if (!user)
            return false

        await sql`BEGIN`;

        const result = await sql`
            INSERT INTO products (name, amount, amount_unit, home_id)
            VALUES (${product.name}, ${product.amount}, ${product.unit}, ${user.home_id})
            RETURNING id
        `;

        const productId = result[0].id;

        for (const variation of variations) {
            await sql`
                INSERT INTO product_variations (product_id, brand, location, price)
                VALUES (${productId}, ${variation.brand}, ${variation.location}, ${variation.price})
            `;
        }

        await sql`COMMIT`;

        return true
    } catch (error) {
        await sql`ROLLBACK`;
        console.error('Error adding product and variations:', error);
        return false
    }
}

export async function updateProductRequired(productId, isRequired) {
    try {
        const user = getAuth();

        if (!user) {
            return false;
        }

        const result = await sql`
            UPDATE products
            SET is_required = ${isRequired}
            WHERE id = ${productId} AND home_id = ${user.home_id}
            RETURNING id
        `;

        if (result.length > 0) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error updating product is_required:', error);
        return false;
    }
}

export async function addProductVariation(productId, variation) {
    try {
        const user = getAuth();

        if (!user)
            return false;

        await sql`
            INSERT INTO product_variations (product_id, brand, location, price)
            VALUES (${productId}, ${variation.brand}, ${variation.location}, ${variation.price})
        `;

        return true;
    } catch (error) {
        console.error('Error adding product variation:', error);
        return false;
    }
}