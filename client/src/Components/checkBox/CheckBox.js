import React from "react";
import './CheckBox.css'

const Checkbox = ({ label, value, onChange }) => {
    return (
        <div className="checkbox-container" >
            <label>
                {label}:
                <input className="filter" type="checkbox" checked={value} onChange={onChange} />
            </label>
        </div>

    );
};

export default Checkbox