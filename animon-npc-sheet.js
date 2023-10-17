import NPCSheet from './module/sheets/AnimonNPCSheet.js';
import { npc } from './module/config.js';

Hooks.on('init', () => {
  console.log('Animon | Registering NPC Sheet');

  CONFIG.animon = npc;

  Object.assign(CONFIG.Actor.dataModels, {
    "animon-npc-sheet.npc": NPCModel,
  });

  DocumentSheetConfig.registerSheet(Actors, "animon", NPCSheet, {
    label: "NPC Sheet",
    types: ["animon-npc-sheet.npc"],
    makeDefault: true
  });

  console.log('Animon | Registering Haku\'s Handlebars Helpers');
  Handlebars.registerHelper('titlecase', (text) => {
    return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toLocaleUpperCase() + txt.substr(1).toLocaleLowerCase());
  });

  Handlebars.registerHelper('upgradeCount', (actor) => {
    const stages = ['fledgling', 'basic', 'super', 'ultra', 'giga'];
    return `(${Object.values(actor.system.upgrades).reduce((sum, u) => sum + u, 0)}/${stages.indexOf(actor.system.stage)})`;
  });
});

class NPCModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      type: new fields.StringField({required: true, blank: true, initial: ""}),
      personality: new fields.StringField({required: true, blank: true, initial: ""}),
      motivation: new fields.StringField({required: true, blank: true, initial: ""}),
      
      wounds: new fields.SchemaField({
        value: new fields.NumberField({required: true, blank: true, initial: 0}),
        max: new fields.NumberField({required: true, blank: true, initial: 0}),
      }),

      traits: new fields.SchemaField({
        level: new fields.NumberField({required: true, blank: true, initial: 1, min: 1, max: 10}),
        skill: new fields.NumberField({required: true, blank: true, initial: 0}),
        initiative: new fields.NumberField({required: true, blank: true, initial: 0}),
        damage: new fields.NumberField({required: true, blank: true, initial: 0}),
        dodge: new fields.NumberField({required: true, blank: true, initial: 0}),
      }),

      bonuses: new fields.SchemaField({
        hp: new fields.NumberField({required: true, blank: true, initial: 0}),
        initiative: new fields.NumberField({required: true, blank: true, initial: 0}),
        damage: new fields.NumberField({required: true, blank: true, initial: 0}),
        dodge: new fields.NumberField({required: true, blank: true, initial: 0}),
      }),

      overrides: new fields.SchemaField({
        hp: new fields.NumberField({required: true, blank: true, initial: 0}),
        initiative: new fields.NumberField({required: true, blank: true, initial: 0}),
        damage: new fields.NumberField({required: true, blank: true, initial: 0}),
        dodge: new fields.NumberField({required: true, blank: true, initial: 0}),
      }),

      stage: new fields.StringField({required: true, blank: true, initial: "basic"}),
      upgrades: new fields.SchemaField({
        aggressive: new fields.NumberField({required: true, blank: true, initial: 0}),
        defensive: new fields.NumberField({required: true, blank: true, initial: 0}),
        tough: new fields.NumberField({required: true, blank: true, initial: 0}),
        swift: new fields.NumberField({required: true, blank: true, initial: 0})
      }),
      classification: new fields.StringField({required: true, blank: true, initial: ""}),
      element: new fields.StringField({required: true, blank: true, initial: ""}),
      weaknesses: new fields.StringField(),
      special: new fields.HTMLField({required: false, blank: true, initial: ""}),
    }
  }
}

/**
 * Hooks.on("init", () => {
  Object.assign(CONFIG.Actor.dataModels, {
    "my-module.sidekick": SidekickModel,
    "my-module.villain": VillainModel
  });
  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    "my-module.dossier": DossierModel,
    "my-module.quest": QuestModel
  });
});

class QuestModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({required: false, blank: true, initial: ""}),
      steps: new fields.ArrayField(new fields.StringField())
    };
  }

  prepareDerivedData() {
    this.totalSteps = this.steps.length;
  }
}
 */