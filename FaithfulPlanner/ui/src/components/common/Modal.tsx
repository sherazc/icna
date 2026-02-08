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
}

export const Modal: React.FC<Props> = ({ children, config }) => {

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

  }

  return (
    <div id="configModal" className="modal show">
      <div className="modalContent" style={{maxWidth: "500px"}}>
        <div className="modalHeader">
          <h3 id="modalTitle">{modalConfig.title}</h3>
          <button className="closeBtn" data-onclick="closeConfigModal()">&times;</button>
        </div>
        <div style={{padding: "20px", borderBottom: "1px solid var(--border-color)"}}>
          <p id="modalMessage" className="text-secondary">
            {children}
          </p>
        </div>
        <div className="modalActions">
          <button id="modalCancelBtn" className="btn btnSecondary" data-onclick="handleModalCancel()" style={{display: "none"}}>Cancel</button>
          <button id="modalOkBtn" className="btn btnPrimary">{modalConfig.yesLabel}</button>
        </div>
      </div>
    </div>
  );
}
