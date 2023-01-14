import { Fragment } from "react"
import { createPortal } from "react-dom"
import classes from './Modal.module.css'


/**
 * Modal background
 *
 * @param {Object}  props          - props
 * @param {function} props.onClose - close modal function (required)
 */
const Background = (props) => {
    return <div className={classes["modal-background"]} onClick={props.onClose}/>
}

/**
 * Main modal component
 *
 * @param {Object} props - props
 */
const ModalOverlay = (props) => {
    return (
        <div className={classes["modal-main"]}>
            <div>{props.children}</div>
        </div>
    )
} 


/** @type {Document} where to generate modal */
const portalElement = document.getElementById('overlays')


/**
 * Universal modal
 *
 * @param {Object}   props         - props
 * @param {function} props.onClose - close modal function (required)
 */
export default function Modal(props){
    return (
        <Fragment>
            {createPortal(<Background onClose={props.onClose}/>, portalElement)}
            {createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
        </Fragment>
    )
}