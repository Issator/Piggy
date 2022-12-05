import ProductCard from "../Components/Cards/ProductCard"
import NewProductCard from "../Components/Cards/NewProductCard"

export default function MainPage(){
    return (
        <div>
            <div>
                <NewProductCard/>
                <ProductCard name="produkt 1" cost="250.00" end_date="2023-1-12" left="122.25" daily="7.25"/>
                <ProductCard name="produkt 2" cost="125.50" end_date="2023-2-08" left="112.45" daily="12.00" />
                <ProductCard name="produkt 3" cost="55.60"  end_date="2023-6-17" left="23.60"  daily="3.42"  />
                <ProductCard name="produkt 4" cost="149.99" end_date="2023-3-05" left="105.56" daily="12.56" />
            </div>
        </div>
    )
}