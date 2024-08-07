// import AnimonCharacterSheet from '../../../../systems/animon/module/sheets/AnimonCharacterSheet.js';
import AnimonCharacterSheet from '../base.js';
import * as dice from '../dice.js';

export default class AnimonNPCSheet extends AnimonCharacterSheet {
  get template() {
    return "modules/animon-npc-sheet/templates/sheets/npc-sheet.hbs";
  }

  async getData() {
    const data = await super.getData();
    data.config = CONFIG.npc;

    data.enrichedSpecial = await TextEditor.enrichHTML(this.object.system.special, { async: true });
    this._prepareNPCItems(data);
    this._prepareStats(data);

    return data;
  }

  _prepareNPCItems(sheetData) {
    const actorData = sheetData.actor;
    const strengths = [];
    const signatureAttacks = [];

    for (let i of sheetData.items) {
      i.img = i.img;
      if (i.type === 'talent') {
        strengths.push(i);
      }
      if (i.type === 'signatureAttack') {
        signatureAttacks.push(i);
      }
    }

    actorData.strength = strengths;
    actorData.signatureAttack = signatureAttacks;
  }

  _getExpectedStats(actorData) {
    const level = actorData.system.traits.level;
    const type = actorData.system.type;
    const bonuses = actorData.system.bonuses;
    const stage = parseInt(String(actorData.system.stage));
    const skill = 1 + Math.ceil(level / 2) + bonuses.skill;
    const upgrades = actorData.system.upgrades;

    let hp;
    let damage;
    if (type.toLowerCase() === 'animon') {
      hp = 6 + (6 * level);
      damage = (stage - 1) + level;
    } 
    else {
      hp = 5 * level;
      damage = 1;
    }
    hp += upgrades.hp * 10 + bonuses.hp;
    damage += upgrades.damage * 2 + bonuses.damage;
    const dodge = skill + upgrades.dodge + bonuses.dodge;
    const initiative = skill + upgrades.initiative + bonuses.initiative;

    return {
      hp,
      damage,
      skill,
      initiative,
      dodge,
    };
  }

  _prepareStats(sheetData) {
    const actorData = sheetData.actor;
    console.log(actorData, sheetData);

    function checkOverride(stat, value) {
      if (actorData.system.overrides[stat] > 0) {
        return actorData.system.overrides[stat];
      }
      return value;
    }

    function migrateToOverrides(stat, value) {
      if (actorData.system.overrides[stat] === 0) {
        actorData.system.overrides[stat] = value || 0;
      }
    }

    // const currentDamage = actorData.system.traits.damage;
    // const currentDodge = actorData.system.traits.dodge;
    // const currentInitiative = actorData.system.traits.initiative;
    // const currentSkill = actorData.system.traits.skill;

    const { skill, hp, damage, initiative, dodge } = this._getExpectedStats(actorData);
    
    if (actorData.system.traits.skill !== skill) {
      migrateToOverrides('skill', skill);
    }
    if (actorData.system.traits.hp !== hp) {
      migrateToOverrides('hp', hp);
    }
    if (actorData.system.traits.damage !== damage) {
      migrateToOverrides('damage', damage);
    }
    if (actorData.system.traits.initiative !== initiative) {
      migrateToOverrides('initiative', initiative);
    }
    if (actorData.system.traits.dodge !== dodge) {
      migrateToOverrides('dodge', dodge);
    }
    
    actorData.system.traits.skill = checkOverride('skill', skill);
    actorData.system.traits.hp = checkOverride('hp', hp);
    actorData.system.traits.damage = checkOverride('damage', damage);
    actorData.system.traits.initiative = checkOverride('initiative', initiative);
    actorData.system.traits.dodge = checkOverride('dodge', dodge);
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (this.actor.isOwner) {
      html.find('.add-strength').click(this._onAddTalent.bind(this));
    }
  }

  _onRollStat(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let stat = element.dataset.stat;
    let die = element.dataset.value;

    dice.StatCheck(stat, die, this.actor);
}

  _onStageChange(event) {
    event.preventDefault();

    for (let strength of this.actor.strength) {
      this.actor.items.get(strength._id).update({ "system.selected": false });
    }

    for(let signatureAttack of this.actor.signatureAttack) {
      this.actor.items.get(signatureAttack._id).update({ "system.selected": false });
    }
  }

  _onAddSignatureAttack(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemType = "." + element.dataset.type + "-item"
    let itemId = element.closest(itemType).dataset.itemId;
    let signatureAttackId = ""
    let item = this.actor.items.get(itemId);
    if (item.system.selected) {
        item.update({ "system.selected": false })
    } else {
      for (let signatureAttack of this.actor.signatureAttack) {
        signatureAttackId = signatureAttack._id;
        item = this.actor.items.get(signatureAttackId);
        item.update({ "system.selected": false });
      }
        for (let i = 0; i < this.actor.signatureAttack.length; i++) {
            signatureAttackId = this.actor.signatureAttack[i]._id;
            item = this.actor.items.get(signatureAttackId);
            if (signatureAttackId == itemId) {
                item.update({ "system.selected": true })
            } else {
                item.update({ "system.selected": false })
            }
        }
    }
}

  // _onRollStat(event) {
  //   event.preventDefault();
  //   let element = event.currentTarget;
  //   let stat = element.dataset.stat;
  //   let die = element.dataset.value;

  //   dice.StatCheck(stat, die, this.actor);
  // }
}