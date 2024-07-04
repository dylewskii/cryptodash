import React, { useState } from "react";
import QRCode from "qrcode";

const QRCodeGenerator: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");

  const generateQRCode = async () => {
    try {
      const url: string = await QRCode.toDataURL(inputText);
      setQrCodeUrl(url);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Unexpected error generating QR Code");
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInputText(e.target.value)
        }
      />
      <button onClick={generateQRCode}>Generate QR Code</button>
      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
    </div>
  );
};

export default QRCodeGenerator;
