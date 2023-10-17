import AnimonCharacterSheet from '../../../../systems/animon/module/sheets/AnimonCharacterSheet.js';

export default class AnimonNPCSheet extends AnimonCharacterSheet {
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