let notes = [];
let RED = 0;
let GREEN = 0;
let BLUE = 0;
let numNotes = 121;

function setupMidiListeners() {
  if ("requestMIDIAccess" in navigator) {
    navigator
      .requestMIDIAccess()
      .then(listenToInputsFromIACAccess)
      .catch((err) => console.log("err:", err));
  }
}

function listenToInputsFromIACAccess(access) {
  const inputs = access.inputs;

  inputs.forEach((input) => {
    console.log(input.name);
    if (input.name.includes("Bus 1")) {
      input.addEventListener("midimessage", processDrumMidiMessage);
    }
    if (input.name.toLowerCase().includes("mini")) {
      input.addEventListener("midimessage", processMiniLabMidiMessage);
    }
  });

  // const outputs = access.outputs;
  // const abletonOutput = inputs[0];
  // const keyboardOutput = inputs[1];
  // outputs.forEach((output) => {
  //   if (output.name.includes("IAC")) {
  //     output.addEventListener("midimessage", processMidiMessage);
  //   }
  //   if (output.name.toLowerCase().includes("mini")) {
  //   }
  // });
}

// TODO: move this into it's own file?
function processMiniLabMidiMessage(message) {
  const { command, ...rest } = processMidiMessage(message);
  // NOTE ON
  if (command === 9) {
    processNoteOn({ ...rest });
  }
  // NOTE OFF
  if (command === 8) {
    processNoteOff({ ...rest });
  }
  // ROTOAY DIAL
  if (command === 11) {
    processkeyboardControlMessage({ ...rest });
  }
}

// SIMPLE CONTROLS FOR BACGROUND COLOR, more POC than anything
let rgbNoteValues = [93, 73, 75];
let redDial = rgbNoteValues[0];
let greenDial = rgbNoteValues[1];
let blueDial = rgbNoteValues[2];

function processkeyboardControlMessage({ note, velocity }) {
  if (rgbNoteValues.includes(note)) {
    let colorValue = Math.floor((velocity / 127) * 255);
    if (note === redDial) {
      RED = colorValue;
    }
    if (note === greenDial) {
      GREEN = colorValue;
    }
    if (note === blueDial) {
      BLUE = colorValue;
    }
  }
}

//0 - 120
function processNoteOn({ note, velocity }) {
  console.log(note);
  notes[note].show({ velocity });
}

function processNoteOff({ note, velocity }) {
  console.log(note);
  notes[note].hide();
}

function initInstruments() {
  initDrums();
  console.log({ notes });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(RED, GREEN, BLUE);
  initInstruments();
  setupMidiListeners();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initInstruments();
}

function draw() {
  background(RED, GREEN, BLUE);
  DRUM_NOTES.forEach((note) => {
    if (note.isOn) {
      rect(note.x, note.y, note.width, note.height);
    }
  });
}
