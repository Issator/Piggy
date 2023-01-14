import Card from "./Card";

/**
 * Card for creating new product
 *
 * @param {Object} props
 * @param {Function} props.onClick on card click function
 */
export default function NewProductCard({onClick}){
    return (
        <Card className="border-dark bg-dark text-white p-0">         
                <div className="btn border border-2 rounded-1 d-flex align-items-center h-100 justify-content-center" onClick={onClick}>
                    <h5 className="text-center">Dodaj <br/> Product</h5>
                </div>
        </Card>
    )
}