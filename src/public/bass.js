let BASS_NOTES = [];

/*
 * bass elements are different than drum/synth elements
 * rather than having fixed rect's, we want a randomly placed circle on the screen to appear
 * for the note played, then shrink until it's size is less than 1?
 * this can create multiple circles on the screen, despite the bass only being monophonic
 *
 * BASS_NOTES will hold all of the notes, when a note's circle shrinks, we'll remove it from the array
 */

class BassElement {
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
    this.height = Math.floor((velocity / 127) * windowHeight);
  }
  hide() {
    this.isOn = false;
  }
}

// TODO: should this be less if the bass is monophonic?
// maybe we only have like 4?

function processBassNoteOn({ note, velocity }) {
  const bassElement = new BassElement(50, 50, [255, 0, 0]);
  BASS_NOTES.push(bassElement);
}
