import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCode = ({url, isImage, isButton}) => {
  const qrRef = useRef();
  const downloadQRCode = (e) => {
    e.preventDefault();
    let canvas = qrRef.current.querySelector("canvas");
    let image = canvas.toDataURL("image/png");
    let anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `qrcode.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
      size={150}
      bgColor={"#fff"}
      level={"H"}
    />
  );
  return (
    <div className="wrapper my-2">
        <div ref={qrRef} className={!isImage ? "visually-hidden" : ""}>{qrcode}</div>
        {/* <button  onClick={(e) => downloadQRCode(e)} className={!isButton ? "btn btn-outline-light visually-hidden" : "btn btn-outline-light"}>
            Скачать QR код
        </button> */}
    </div>
  );
};

export default QRCode;