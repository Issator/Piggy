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
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="btn-close bg-light p-2 rounded rounded-4 mb-1" data-bs-dismiss="modal" aria-label="Close" onClick={props.onClose}></button>
                </div>
                <div class="modal-body">
                    <div>{props.children}</div>
                </div>
                </div>
            </div>
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
            {createPortal(<ModalOverlay onClose={props.onClose}>{props.children}</ModalOverlay>, portalElement)}
        </Fragment>
    )
}