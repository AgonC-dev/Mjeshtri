
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export default function Modal({
  children,
  onCLose,
  open,
  className = "",
}) {
  const dialog = useRef(null);
  const [modalElement, setModalElement] = useState(null);

  // Find the portal element after the component mounts in the browser.
  useEffect(() => {
    setModalElement(document.getElementById("modal"));
  }, []);

  // Control the native dialog.
  useEffect(() => {
    const modal = dialog.current;

    if (!modal || !modalElement) return;

    if (open && !modal.open) {
      modal.showModal();
    } else if (!open && modal.open) {
      modal.close();
    }

    return () => {
      if (modal.open) {
        modal.close();
      }
    };
  }, [open, modalElement]);

  if (!modalElement) return null;

  return createPortal(
    <dialog
      ref={dialog}
      className={`${styles.modal} ${className}`}
    >
      {children}
    </dialog>,
    modalElement
  );
}
