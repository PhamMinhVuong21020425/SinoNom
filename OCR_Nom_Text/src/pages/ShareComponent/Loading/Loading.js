import { useState } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './Loading.scss';

function Loading() {
    let [color, setColor] = useState('#ffff00');

    return (
        <div className="loading">
            <PacmanLoader color={color} size={20} />
        </div>
    );
}

export default Loading;
