import React from "react";
import "./Spell.css";

function Spell({remaining, cooldown, image, onClick}) {
    const isDisabled = remaining === 0 || cooldown > 0;
    
    return (
        <div className={`spell ${isDisabled ? "disabled" : ""}`} onClick={isDisabled ? null : onClick} >
            <div className="numLeft">x{remaining}</div>
            <img src={image} alt="spell" className="spellImage" />
            <div className="cooldownOverlay">{cooldown}</div>
        </div>
    );
}

export default Spell;