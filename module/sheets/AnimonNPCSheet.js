//import AnimonCharacterSheet from '../../../../systems/animon/module/sheets/AnimonCharacterSheet.js';
import VariantAnimonCharacterSheet from '/modules/animon-variant-rules/module/sheets/AnimonCharacterSheet.js';
import * as dice from '../dice.js';

export default class AnimonNPCSheet extends VariantAnimonCharacterSheet {
  get template() {
    return "modules/animon-npc-sheet/templates/sheets/npc-sheet.hbs";
  }

  async getData() {
    const data = await super.getData();
    data.config = CONFIG.npc;

    data.enrichedSpecial = await TextEditor.enrichHTML(this.object.system.special, { async: true });
    this._prepareNPCItems(data);

    return data;
  }

  async _prepareVariantData(type, data) {
    switch(type) {
      case 'animon-npc-sheet.npc':
        data.data.system.limits = { level: game.settings.get('animon-variant-rules', 'maxNpcLevel') || Infinity };
        break;
      default:
        return await super._prepareVariantData(type, data);
    }

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

  activateListeners(html) {
    super.activateListeners(html);

    if (this.actor.isOwner) {
      html.find('.add-strength').click(this._onAddTalent.bind(this));
      html.find('.update-level').change(this._onUpdateLevel.bind(this));
    }
  }

  _onUpdateLevel(event) {

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