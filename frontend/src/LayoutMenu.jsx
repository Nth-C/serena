

function LayoutMenu({children, title, isOpen, onClose }) {

    return (
        <>
            <div className={[
                "page_menu",
                isOpen ? "active" : ''
            ].join(' ')}>
                <div className="params_header">
                    <button onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>                </button>
                    <h2>{title}</h2>
                </div>
                {children}
            </div>
        </> 
    )
}

export default LayoutMenu