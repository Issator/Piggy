import Spinner from "./Spinner"

/**
 * Main spinner used for page loading
 */
export default function MainSpinner(){
    return <Spinner className="full-center" color="primary" style={{width: "4rem", height: "4rem", borderWidth: "0.5rem"}}/>
}