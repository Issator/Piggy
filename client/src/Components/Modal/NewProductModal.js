import Modal from "./Modal";

/**
 * Modal for new product
 *
 * @param {Object} props 
 * @param {Function} props.onClose - on modal close function
 */
export default function({onClose}){
    return <Modal onClose={onClose}>
        <div className="card" style={{width: "25rem"}}>
                <div className="d-flex justify-content-between card-header pb-1">
                    <div className="card-title">
                        Dodaj product
                    </div>
                </div>
                <div className="card-body">
                    jakieś dane tutaj
                </div>
            </div>
    </Modal>
}