import Card from "./Card";

export default function NewProductCard(){
    return (
        <Card className="border-dark bg-dark text-white">         
                <div className="btn border border-2 rounded-1 d-flex align-items-center h-100 justify-content-center">
                    <h5 className="text-center">Dodaj <br/> Product</h5>
                </div>
        </Card>
    )
}