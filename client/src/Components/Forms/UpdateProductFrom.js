import { useEffect } from "react"

/**
 * from for updating product
 *
 * @param {Object}   props
 * @param {JSON}     props.product  - product data
 * @param {Function} props.onChange - on form data change
 * @return {*} 
 */
export default function UpdateProductForm({product, onChange}){

    useEffect(() => {
        const data = {
            name: product.name,
            cost: product.cost,
            end_date: product.end_date
        }
        onChange(data)
    }, [])

    /**
     * handle value change
     * @param {import("react").ChangeEvent<HTMLFormElement>} e event
     */
    const changeValue = (e) => {
        const formData = new FormData(e.currentTarget);
        const data = {}
        for (let [key, value] of formData.entries()) {
            data[key] = value
        }

        onChange(data)
    }

    return (
        <form onChange={changeValue}>
            <div className="d-flex justify-content-between align-items-center mb-1">
                Nazwa: <input className="form-control ms-1 p-1"
                                type="text"
                                name="name"
                                defaultValue={product.name}/>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-1">
                Koszt: <input className="form-control ms-1 p-1"
                                type="number"
                                name="cost"
                                defaultValue={product.cost}/>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-1">
                Data: <input className="form-control ms-1 p-1"
                            type="date"
                            name="end_date"
                            defaultValue={product.end_date}/>
            </div>
        </form>
    )
}