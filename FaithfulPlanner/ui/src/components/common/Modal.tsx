import "./Modal.css"

export enum ModalType { DEFAULT, INFORMATION, WARNING, ERROR }
export type ModalConfig = {
  title?: string,
  yesFunction?: () => void,
  yesLabel?: string
  noFunction?: () => void,
  noLabel?: string
  closeFunction?: () => void,
  minimumWidth?: number,
  modalType?: ModalType
}

interface Props {
  children: React.ReactNode;
  config: ModalConfig;
  show: boolean;
  setShow: (show: boolean) => void
}

export const Modal: React.FC<Props> = ({ children, config, show, setShow }) => {

  const modalConfig: ModalConfig = {
    modalType: config.modalType || ModalType.DEFAULT,
    title: config.title || '',
    yesFunction: config.yesFunction || undefined,
    yesLabel: config.yesLabel || "Ok",
    noFunction: config.noFunction || undefined,
    noLabel: config.noLabel || "",
    closeFunction: config.closeFunction || undefined,
    // minimumWidth?: number,
  }

  const handleClose = () => {
    if (modalConfig.closeFunction) {
      modalConfig.closeFunction();
    }
    setShow(false);
  }

  const handleYes = () => {
    if (modalConfig.yesFunction) {
      modalConfig.yesFunction();
    }
    setShow(false);
  }

  const handleNo = () => {
    if (modalConfig.noFunction) {
      modalConfig.noFunction();
    }
    setShow(false);
  }

  // if (!show) {
  //   return <></>
  // }

  return (
    <div id="configModal" className={show ? "modal show" : "modal"}>
      <div className="modalContent" style={{maxWidth: "500px"}}>
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
