let circles = [];
let RED = 0;
let GREEN = 0;
let BLUE = 0;
let numNotes = 121;

function setupMidiListeners() {
  if ("requestMIDIAccess" in navigator) {
    navigator
      .requestMIDIAccess()
      .then(listenToInputsFromAcess)
      .catch((err) => console.log("err:", err));
  }
}

function listenToInputsFromAcess(access) {
  const inputs = access.inputs;

  inputs.forEach((input) => {
    if (input.name.includes("IAC")) {
      input.onmidimessage = processMidiMessage;
    }
    if (input.name.toLowerCase().includes("mini")) {
      input.addEventListener("midimessage", (message) => {
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
      });
    }
  });

  const outputs = access.outputs;
  const abletonOutput = inputs[0];
  const keyboardOutput = inputs[1];
  outputs.forEach((output) => {
    if (output.name.includes("IAC")) {
      output.addEventListener("midimessage", processMidiMessage);
    }
    if (output.name.toLowerCase().includes("mini")) {
      // output.addEventListener("midimessage", (message) => {
      //   console.log({ message });
      //   const { command, ...res } = processMidiMessage(message);
      //   if (command === 11) {
      //     processkeyboardControlMessage({ ...rest });
      //   }
      // });
    }
  });
}

function processMidiMessage({ data }) {
  return {
    command: data[0] >> 4,
    channel: data[0] & 0xf,
    note: data[1],
    velocity: data[2],
  };
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
  circles[note].show({ velocity });
}

function processNoteOff({ note, velocity }) {
  console.log(note);
  circles[note].hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // notes go from 1 to 120
  let notesUpperbound = numNotes + 1;
  for (let i = 0; i < numNotes; i++) {
    circles[i] = new NoteRect(
      Math.floor((i / numNotes) * windowWidth),
      Math.floor(windowWidth / 120),
      [(255, 100, 10)]
    );
  }
  background(RED, GREEN, BLUE);
  setupMidiListeners();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(RED, GREEN, BLUE);
  circles.forEach((circle) => {
    if (circle.isOn) {
      // ellipse(circle.x, circle.y, circle.size, circle.size);
      rect(circle.x, circle.y, circle.width, circle.height);
    }
  });
}

class NoteCircle {
  constructor(x, y, size, color, isOn = false) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.isOn = isOn;
  }

  show({ velocity }) {
    this.isOn = true;
    this.size = this.size * velocity;
  }
  hide() {
    this.isOn = false;
    this.size = 2;
  }
}
class NoteRect {
  constructor(x, width, color, isOn = false) {
    this.x = x;
    this.y = 0;
    this.width = width;
    this.height = 0;
    this.color = color;
    this.isOn = isOn;
  }

  show({ velocity }) {
    this.isOn = true;
    this.height = Math.floor((velocity / 127) * windowHeight);
  }
  hide() {
    this.isOn = false;
    this.size = 2;
  }
}
