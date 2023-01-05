// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';
import { uid } from './modules/uid.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='notes'>
    <h2 class='title'>Notes</h2>
    <div class='main' data-notes=''>
      <div class='item item--add'>
        <button data-create=''>${feather.icons.plus.toSvg()}</button>
        <p>Add new note</p>
      </div>
    </div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;


// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      btnCreate: document.querySelector('[data-create]'),
      notes: document.querySelector('[data-notes]'),
    };

    this.PROPS = {
      notes: this.storageGet(),
    };

    this.storageDisplay();
    this.DOM.btnCreate.addEventListener('click', this.onCreate);
  }

  /**
   * @function onCreate - Create Note
   */
  onCreate = () => {
    this.PROPS.notes = [...this.PROPS.notes, {
      text: '',
      id: uid(),
    }];
    this.renderHTML(this.PROPS.notes);
    this.storageAdd(this.PROPS.notes);
    showNotification('success', 'The note has been successfully created.');
  };

  /**
   * @function renderHTML - Render data HTML
   * @param data
   */
  renderHTML = (data) => {
    document.querySelectorAll('.item:not(.item--add)').forEach(note => note.remove())

    for (const { text, id } of data) {
      const note = document.createElement('div');
      note.classList.add('item');
      note.innerHTML = `<textarea data-id='${id}' placeholder='Empty Sticky Note'>${text}</textarea>`;
      this.DOM.notes.insertBefore(note, this.DOM.notes.querySelector('.item--add'));
      const textarea = note.querySelector('textarea');
      textarea.addEventListener('dblclick', this.onDelete);
      textarea.addEventListener('change', this.onChange);
    }
  };

  /**
   * @function onDelete - Delete note
   * @param target
   */
  onDelete = ({ target }) => {
    if (confirm('Are you sure you want to delete the note?')) {
      target.closest('.item').remove();
      this.PROPS.notes = this.PROPS.notes.filter(({ id }) => id !== target.dataset.id);
      this.storageAdd(this.PROPS.notes);
      showNotification('success', 'The note has been successfully deleted.');
    }
  };

  /**
   * @function onChange - Textarea change event handler
   * @param value
   * @param noteID
   */
  onChange = ({ target: { value, dataset: { id: noteID } } }) => {
    this.PROPS.notes = this.PROPS.notes.map((note => note.id === noteID ? { ...note, text: value } : note));
    this.renderHTML(this.PROPS.notes);
    this.storageAdd(this.PROPS.notes);
  };

  /**
   * @function storageGet - Get data from local storage
   * @returns {any|*[]}
   */
  storageGet = () => {
    return localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
  };

  /**
   * @function storageAdd - Add data to local storage
   */
  storageAdd = (data) => {
    return localStorage.setItem('notes', JSON.stringify(data));
  };

  /**
   * @function storageDisplay - Get and display from local storage
   */
  storageDisplay = () => {
    const notes = this.storageGet();
    this.renderHTML(notes);
  };
}

// ⚡️Class instance
new App();
