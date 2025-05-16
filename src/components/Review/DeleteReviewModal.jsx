import { useState, useContext } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const DeleteReviewModal = ({ isOpen, onClose, review, onReviewDeleted }) => {
  const { authFetch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !review) {
    return null;
  }

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await authFetch(`/admin/reviews/${review.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorData = { message: "Gagal menghapus ulasan." };
        try {
          errorData = await response.json();
        } catch (e) {
          console.error("Failed to parse error JSON on delete", e);
        }
        toast.error(errorData.message || "Gagal menghapus ulasan.");
      } else {
        let successMessage = "Ulasan berhasil dihapus.";
        try {
          const data = await response.json();
          successMessage = data.message || successMessage;
        } catch (e) {
          /* Abaikan jika tidak ada body JSON */
        }

        toast.success(successMessage);
        if (onReviewDeleted) {
          onReviewDeleted(review.id);
        }
        onClose();
      }
    } catch (error) {
      console.error("Error deleting ulasan:", error);
      if (error.message !== "Unauthorized") {
        toast.error("Terjadi kesalahan jaringan saat menghapus ulasan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus Ulasan">
      <p className="mb-6 text-sm text-gray-700">
        {" "}
        Apakah Anda yakin ingin menghapus ulasan ini?
        Tindakan ini tidak dapat diurungkan.
      </p>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        {" "}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ${
            loading
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
    </Modal>
  );
};

DeleteReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  review: PropTypes.shape({
    id: PropTypes.number,
  }),
  onReviewDeleted: PropTypes.func.isRequired,
};

export default DeleteReviewModal;
