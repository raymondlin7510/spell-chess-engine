import Spell from "./Spell";
import "./SpellBook.css";

function SpellBook({ side, freezeLeft, freezeCooldown, jumpLeft, jumpCooldown, setState, state }) {
     const handleSpellClick = (spell) => {
        if (state == null) {
            setState(side + spell);
        } else {
            setState(null);
        }
    };

    return (
        <div className="spellBook">
            <Spell remaining={freezeLeft} cooldown={freezeCooldown} image={"/images/freezeSpell.webp"} onClick={() => handleSpellClick('freeze')}/>
            <Spell remaining={jumpLeft} cooldown={jumpCooldown} image={"images/jumpSpell.webp"} onClick={() => handleSpellClick('jump')}/>
        </div>
    );
}

export default SpellBook;