import styles from './WhatsAppButton.module.css';
import { doc, updateDoc, increment } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from '../../api/firebase';
import Modal from '../Modal/Modal';
import { useState } from 'react';
import ContactForm from '../ContactForm/ContactForm';

const functions = getFunctions();

function WhatsAppButton({ workerId, phoneNumber, workerName, disabled}) {
const [showContactModal, setShowContactModal] = useState(false);

return (
    <>
      <button 
        className={styles.button} 
        onClick={() => setShowContactModal(true)}
        disabled={disabled}
      >
        Kontakto në WhatsApp
      </button>

      <Modal 
        open={showContactModal} 
        onClose={() => setShowContactModal(false)}
      >
        <ContactForm 
          workerId={workerId}
          workerPhone={phoneNumber}
          workerName={workerName}
          onClose={() => setShowContactModal(false)}
        />
      </Modal>
    </>
  );
}

export default WhatsAppButton;