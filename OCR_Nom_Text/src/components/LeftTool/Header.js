import './Header.scss';

function ToolHeader() {
    return (
        <div className="container">
            <div className="title">Title Image</div>
            <div className="button-top">
                <button>Prev</button>
            </div>
            <div className="button-top">
                <button>Next</button>
            </div>
            <div className="button-top">
                <button>Setting</button>
            </div>
            <div className="button-top">
                <button>Fullscreen</button>
            </div>
            <div className="button-top">
                <button>Export</button>
            </div>
        </div>
    );
}

export default ToolHeader;
