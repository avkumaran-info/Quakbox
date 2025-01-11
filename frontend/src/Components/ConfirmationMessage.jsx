import { FaExclamationTriangle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ConfirmationMessage = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal show d-block" role="dialog">
      <div
        className="modal-dialog"
        role="document"
        style={{
          maxWidth: "500px",
          height: "200px",
        }}
      >
        <div className="modal-content text-center border-warning">
          <div className="modal-body" style={{ padding: "10px" }}>
            <FaExclamationTriangle size={40} color="orange" />
            <h6 className="text-warning" style={{ fontWeight: "bold" }}>
              {message}
            </h6>
          </div>
          <div className="modal-footer justify-content-center border-0">
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
