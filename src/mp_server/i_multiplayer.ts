export const listInstruments = ["piano", "bass", "guitar_elec", "drums"];

export interface INotesPerInstrument {[key: string]: string[]; }

export class NotesRecord {
  public notesPerInstrument: INotesPerInstrument = {};
  constructor() {
    this.reset();
  }
  public reset(): void {
    this.notesPerInstrument = {}
    for (let instrument of listInstruments) {
    // listInstruments.forEach((instrument) => {
      this.notesPerInstrument[instrument] = [];
    }
  }
  public resetRecord(instrument: string): void {
    this.notesPerInstrument[instrument] = [];
  }
  public mergeNotes(instrument: string, newNotes: string[]) {
    const notes = this.notesPerInstrument[instrument];
    for (let note of newNotes) {
    // newNotes.forEach((note) => {
      if (notes.indexOf(note) === -1) {
        notes.push(note);
      }
    }
  }
  public getRecord(instrument: string): string[] {
    return this.notesPerInstrument[instrument];
  }
  public isEmpty(): boolean {
      for (let instrument of listInstruments) {
          if (this.getRecord(instrument).length > 0) {
              return false;
          }
      }
      return true;
  }
}
