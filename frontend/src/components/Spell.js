import React from "react";
import "./Spell.css";

function Spell({remaining, cooldown, image}) {
    return (
        <div className="spell">
            <div className="numLeft">x{remaining}</div>
            <img src={image} alt="spell" className="spellImage"/>
        </div>
    );
}

export default Spell;