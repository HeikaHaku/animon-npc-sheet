export async function StatCheck(stat, die, actor) {
  let rollFormula = "";
  let sigUses = 0;
  let checkOptions = await GetStatCheckOptions(stat)

  if (checkOptions.cancelled) {
      return;
  }

  let dice = parseInt(die) + parseInt(checkOptions.extra);
  let item = null;
  let itemId = "";

  for (let strength of actor.strength) {
    if (strength.system.selected) {
        dice = dice + parseInt(strength.system.rank);
        itemId = strength._id
        item = actor.items.get(itemId);
        item.update({ "system.selected": false });
    };
  }

  console.log(actor);

  if (actor.system.type == "animon") {
    for(let signatureAttack of actor.signatureAttack) {
      if (signatureAttack.system.selected) {
          dice = dice + parseInt(signatureAttack.system.rank);
          itemId = signatureAttack._id
          item = actor.items.get(itemId);
          item.update({ "system.selected": false });
      };
    }
  }

  rollFormula = dice + "d6cs>=" + checkOptions.type

  let messageData = {
      speaker: ChatMessage.getSpeaker()
  }

  let rollResult = new Roll(rollFormula).roll({ async: false })
  rollResult.toMessage(messageData)

}

async function GetStatCheckOptions(stat) {
  const template = "systems/animon/templates/chat/stat-check-dialog.hbs";
  const html = await renderTemplate(template, {});

  return new Promise(resolve => {
      const data = {
          title: game.i18n.format("animon.chat.title", { type: stat }),
          content: html,
          buttons: {
              normal: {
                  label: game.i18n.localize("animon.chat.roll"),
                  callback: html => resolve(_processStatCheckOptions(html[0].querySelector("form")))
              },
              cancel: {
                  label: game.i18n.localize("animon.chat.cancel"),
                  callback: html => resolve({ cancelled: true })
              }
          },
          default: "normal",
          close: () => resolve({ cancelled: true })
      };

      new Dialog(data, null).render(true);
  });
}

function _processStatCheckOptions(form) {
  return {
      type: form.type.value,
      extra: form.extra.value
  };
}