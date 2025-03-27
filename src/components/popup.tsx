import Swal from "sweetalert2";

export const showConfirmationDialog = async (
  title: string,
  text: string,
  confirmButtonText: string
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,
  });

  return result.isConfirmed;
};
