const DRUM_NOTES = [];
const DRUM_RACK_NOTE_OFFSET = 36; // FIRST MIDI NOTE IN DEFAULT DRUMRACK IS 36
const NUM_DRUM_NOTES = 16;

class DrumElement {
  constructor(x, width, color, isOn = false) {
    this.x = x;
    this.y = windowHeight;
    this.width = width;
    this.height = 0;
    this.color = color;
    this.isOn = isOn;
  }
  show({ velocity }) {
    this.isOn = true;
    this.height = -Math.floor((velocity / 127) * windowHeight);
  }
  hide() {
    this.isOn = false;
  }
}

function initDrums() {
  for (let i = 0; i < NUM_DRUM_NOTES; i++) {
    DRUM_NOTES[i] = new DrumElement(
      Math.floor((i / NUM_DRUM_NOTES) * windowWidth),
      Math.floor(windowWidth / NUM_DRUM_NOTES),
      [255, 100, 10]
    );
  }
}

function processDrumMidiMessage(message) {
  const { command, ...rest } = processMidiMessage(message);
  if (command === 9) {
    processDrumNoteOn({ ...rest });
  }
  // NOTE OFF
  if (command === 8) {
    processDrumNoteOff({ ...rest });
  }
}

function processDrumNoteOn({ note, velocity }) {
  note = note - DRUM_RACK_NOTE_OFFSET;
  DRUM_NOTES[note].show({ velocity });
}

function processDrumNoteOff({ note, velocity }) {
  note = note - DRUM_RACK_NOTE_OFFSET;
  DRUM_NOTES[note].hide();
}

function drawDrumNotes() {
  DRUM_NOTES.forEach((note) => {
    if (note.isOn) {
      let c = color(...note.color);
      fill(c);
      rect(note.x, note.y, note.width, note.height);
    }
  });
}
