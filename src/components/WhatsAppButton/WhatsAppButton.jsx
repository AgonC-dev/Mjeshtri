import styles from './WhatsAppButton.module.css';
import { doc, updateDoc, increment } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from '../../api/firebase';
import Modal from '../Modal/Modal';
import { useState } from 'react';
import ContactForm from '../ContactForm/ContactForm';

const functions = getFunctions();

function WhatsAppButton({ id, phoneNumber, workerName}) {
const [showContactModal, setShowContactModal] = useState(false);

return (
    <>
      <button 
        className={styles.button} 
        onClick={() => setShowContactModal(true)}
      >
        Kontakto në WhatsApp
      </button>

      <Modal 
        open={showContactModal} 
        onClose={() => setShowContactModal(false)}
      >
        <ContactForm 
          workerId={id}
          workerPhone={phoneNumber}
          workerName={workerName}
          onClose={() => setShowContactModal(false)}
        />
      </Modal>
    </>
  );
}

export default WhatsAppButton;