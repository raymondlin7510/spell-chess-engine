import Spell from "./Spell";
import "./SpellBook.css";

function SpellBook({ turn, side, setMoveSquares, spellState, setState, freezeLeft, freezeCooldown, jumpLeft, jumpCooldown }) {
     const handleSpellClick = (spell) => {
        if (spellState != null || (turn === 1 && side === "white") || (turn === 0 && side === "black")) {
            return;
        }
        setMoveSquares({});
        setState(spell + "choosing");
    };

    return (
        <div className="spellBook">
            <Spell remaining={freezeLeft} cooldown={freezeCooldown} image={"/images/freezeSpell.webp"} onClick={() => handleSpellClick('freeze')}/>
            <Spell remaining={jumpLeft} cooldown={jumpCooldown} image={"images/jumpSpell.webp"} onClick={() => handleSpellClick('jump')}/>
        </div>
    );
}

export default SpellBook;