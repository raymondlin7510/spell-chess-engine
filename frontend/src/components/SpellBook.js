import Spell from "./Spell";
import "./SpellBook.css";

function SpellBook({spellBook}) {
    return (
        <div className="spellBook">
            <Spell remaining={spellBook[0][0]} cooldown={spellBook[0][1]} image={"/images/freezeSpell.webp"}/>
            <Spell remaining={spellBook[1][0]} cooldown={spellBook[1][1]} image={"images/jumpSpell.webp"}/>
        </div>
    );
}

export default SpellBook;