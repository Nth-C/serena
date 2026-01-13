import { useNavigate } from 'react-router-dom';

function LayoutMenu({children, title}) {
    const navigate = useNavigate();

    return (
        <>
            <div className="page_menu">
                <div className="params_header">
                    <button onClick={() => navigate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>                </button>
                    <h2>{title}</h2>
                </div>
                {children}
            </div>
        </> 
    )
}

export default LayoutMenu