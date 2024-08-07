var AnimonCharacterSheet;

try {
  AnimonCharacterSheet = await import('/modules/animon-damage-update/module/sheets/AnimonCharacterSheet.js');
}
catch {
  AnimonCharacterSheet = await import('/systems/animon/module/sheets/AnimonCharacterSheet.js');
}

export default AnimonCharacterSheet.default;