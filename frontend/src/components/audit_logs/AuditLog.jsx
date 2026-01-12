import styles from './AuditLog.module.css';

import LayoutMenu from '../../LayoutMenu'

const AuditLog = ({isOpen, onClose }) => {

    return (
        <LayoutMenu
            title={"Audit log"} 
            isOpen={isOpen} 
            onClose={onClose}
        >
            <div className={styles.audit_log}>

            </div>
        </LayoutMenu>
    )
}

export default AuditLog;