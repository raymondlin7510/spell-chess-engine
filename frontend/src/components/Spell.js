import React from "react";
import "./Spell.css";

function Spell({remaining, cooldown, image, onClick}) {

    return (
        <>
            {remaining == 0 || cooldown > 0 ? (
                <div className="spell">
                    <div className="numLeft">x{remaining}</div>
                    <img src={image} alt="spell" className="spellImage"/>
                </div>
            ) : (
                <div className="spell" onClick={onClick}>
                    <div className="numLeft">x{remaining}</div>
                    <img src={image} alt="spell" className="spellImage"/>
                </div>
            )}
        </>
        
    );
}

export default Spell;