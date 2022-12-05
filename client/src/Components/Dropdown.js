import { CSSProperties } from "react"

/**
 * Bootstrap dropdown
 * @param {Object}     props
 * @param {string}     props.text       - Button Text
 * @param {StyleSheet} props.className  - Button ClassName
 * @param {string}     props.id         - dropdown ID
 * @param {CSSProperties} props.style - stylesheet for dropdown
 * @param {("start"|"end")}               props.align - dropdown menu align
 * @param {("start"|"end"|"up"|"down")}   props.drop  - drop direction
 */
export default function Dropdown(props){

    const align = (props.align ? "dropdown-menu-" + props.align.toLowerCase() : "")
    const dropDirection = "drop" + (props.drop?.toLowerCase() || "down")
    return(
        <div className={dropDirection}>
            <button className={`${props.className} dropdown-toggle`} type="button" id={props.id} data-bs-toggle="dropdown">
                {props.text}
            </button>
            <div className={`dropdown-menu ${align}`} aria-labelledby={props.id} style={props.style}>
                {props.children}
            </div>
        </div>
    )
}