import { memo } from "react"; // 1. Import memo
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../api/firebase";
import { useState, useEffect } from "react";

// 2. Wrap the function
const StorageImage = memo(function StorageImage({ path, className }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!path) return;

    const fetchUrl = async () => {
      try {
        const imageRef = ref(storage, path);
        const downloadUrl = await getDownloadURL(imageRef);
        if (isMounted) setUrl(downloadUrl);
      } catch (err) {
        if (isMounted) setError(true);
      }
    };

    fetchUrl();
    return () => { isMounted = false; };
  }, [path]);

  if (error) return <div className={className} style={{background: '#fee2e2'}}>⚠️</div>;
  if (!url) return <div className={className} style={{background: '#f1f5f9'}}></div>;

  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img src={url} alt="ID Preview" className={className} />
    </a>
  );
});

export default StorageImage;