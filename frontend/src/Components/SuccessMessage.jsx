import { FaCheckCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const SuccessMessage = ({ message, onConfirm }) => {
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
        <div className="modal-content text-center border-success">
          <div className="modal-body" style={{ padding: "10px" }}>
            <FaCheckCircle size={40} color="green" />
            <h6 className="text-success" style={{ fontWeight: "bold" }}>
              {message}
            </h6>
          </div>
          <div className="modal-footer justify-content-center border-0">
            <button
              type="button"
              className="btn btn-sm btn-warning"
              onClick={onConfirm}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
