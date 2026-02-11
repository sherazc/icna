import { ModalType, type ModalConfig } from "../../service/service-types";
import "./Modal.css"

interface Props {
  children: React.ReactNode;
  config: ModalConfig;
  show: boolean;
  setShow: (show: boolean) => void
};

export const Modal: React.FC<Props> = ({ children, config, show, setShow }) => {

  const modalConfig: ModalConfig = {
    modalType: config.modalType || ModalType.DEFAULT,
    title: config.title || '',
    yesFunction: config.yesFunction || undefined,
    yesLabel: config.yesLabel || "Ok",
    noFunction: config.noFunction || undefined,
    noLabel: config.noLabel || "",
    closeFunction: config.closeFunction || undefined,
    maxWidth: config.maxWidth || config.width || undefined,
    width: config.width || undefined
  };

  const handleClose = () => {
    if (modalConfig.closeFunction) {
      modalConfig.closeFunction();
    }
    setShow(false);
  };

  const handleYes = () => {
    if (modalConfig.yesFunction) {
      modalConfig.yesFunction();
    }
    setShow(false);
  };

  const handleNo = () => {
    if (modalConfig.noFunction) {
      modalConfig.noFunction();
    }
    setShow(false);
  };

  const getModalClasses = (showModal: boolean, modalType?: ModalType): string => {
    let classes = "modal";
    if (showModal) {
      classes += " show";
    }
    switch (modalType) {
      case ModalType.ERROR: 
        classes += " error"
        break;
      case ModalType.INFORMATION: 
        classes += " confirm"
        break;
      case ModalType.WARNING: 
        classes += " warning"
        break;
      default: 
        break;
    };

    return classes;
  };

  if (!show) {
    return <></>
  }

  return (
    <div className={getModalClasses(show, modalConfig.modalType)} >
      <div className="modalContent" style={{width: modalConfig.width, maxWidth: modalConfig.maxWidth}}>
        <div className="modalHeader">
          <h3 id="modalTitle">{modalConfig.title}</h3>
          <button className="closeBtn" onClick={handleClose}>&times;</button>
        </div>
        <div style={{padding: "20px", borderBottom: "1px solid var(--border-color)"}}>
          <p id="modalMessage" className="text-secondary">
            {children}
          </p>
        </div>
        <div className="modalActions">
          <button id="modalCancelBtn" className="btn btnSecondary" onClick={handleNo} style={{display: "none"}}>Cancel</button>
          <button id="modalOkBtn" className="btn btnPrimary" onClick={handleYes}>{modalConfig.yesLabel}</button>
        </div>
      </div>
    </div>
  );
}
