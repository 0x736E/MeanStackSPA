export class Task {
  id: String;
  created_at: Date;
  text: String;

  constructor(text: String, id?: String) {
    this.id = id ? id : null;       // the server will create a unique id
    this.created_at = new Date();
    this.text = text;
  }
}
