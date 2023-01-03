import { CSSProperties } from "react"

/**
 * Universal card component
 * @param {Object} props
 * @param {CSSProperties} props.className card extra classes
 * @export
 */
export default function Card(props){
    return (
        <div className={"card border border-3 m-2 " + props.className}  
                style={{width: '14rem', height: '18rem'}}
        >
            {props.children}
        </div>
    )
}