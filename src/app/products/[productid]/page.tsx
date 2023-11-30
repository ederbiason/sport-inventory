import axios from "axios"
import { cookies } from "next/headers"
import ProductImages from "./ProductImages"
import ProductActionButtons from "./ProductActionButtons"

export default async function ProductInfo({ params }: { params: { productid: string } }) {
    async function getProduct(productid: string) {
        try {
            const cookieStore = cookies()
            const token = cookieStore.get('token')?.value

            const endpoint = `${process.env.domain}/api/products/${productid}`
            const response = await axios.get(endpoint, {
                headers: {
                    Cookie: `token=${token}`
                }
            })

            return response.data || []
        } catch (error: any) {
            console.log(error.message)
            return []
        }
    }

    const product = await getProduct(params.productid)

    return (
        <div className="p-10">
            {
                product &&
                <div className="grid grid-cols-2 gap-5">
                    <ProductImages
                        product={product}
                    />

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold">{product.name}</h1>

                        <div className="text-gray-600">
                            {product.description}
                        </div>

                        <h1 className="text-5xl my-5 font-semibold">
                            R$ {product.price}
                        </h1>

                        <ProductActionButtons
                            product={product}
                        />
                    </div>
                </div>
            }
        </div>
    )
}
