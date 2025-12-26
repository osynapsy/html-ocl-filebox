class OclFileBox 
{
    constructor(element)
    {
        this.box = element;
        this.input = this.box.querySelector('input[type="file"]');
        this.fileList = this.box.querySelector('.file-list');
        this.filesArray = [];
        this.allowMultiple = this.box.dataset.multiple === "true";
        this.isEmpty = true;
        this.accept = this.box.dataset.accept || ''; // legge l'attributo data-accept
        // Imposta l’attributo multiple sull’input
        if (this.allowMultiple) {
            this.input.setAttribute('multiple', 'multiple');
        } else {
            this.input.removeAttribute('multiple');
        }
        // Dentro il costruttore
        if (this.accept) {
            this.input.setAttribute('accept', this.accept);
        } else {
            this.input.removeAttribute('accept');
        }
        
        // Eventi
        this.box.addEventListener('click', () => this.input.click());
        this.box.addEventListener('dragover', (e) => this.dragOver(e));
        this.box.addEventListener('dragleave', () => this.dragLeave());
        this.box.addEventListener('drop', (e) => this.drop(e));
        this.input.addEventListener('change', () => this.filesSelected());
    }

    dragOver(e)
    {
        e.preventDefault();
        this.box.classList.add('hover');
    }

    dragLeave()
    {
        this.box.classList.remove('hover');
    }

    drop(e)
    {
        e.preventDefault();
        this.box.classList.remove('hover');
        this.filesArray = this.filesArray.concat(Array.from(e.dataTransfer.files));
        this.updateFileList();
    }

    filesSelected()
    {
        const selectedFiles = Array.from(this.input.files);
        this.addFiles(selectedFiles);
        // reset input originale per permettere selezione dei file già scelti        
        this.input.value = '';
        
        // rimuovo eventuali input temporanei precedenti
        this.box.querySelectorAll('.temp-file-input').forEach(el => el.remove());

        // creo un input temporaneo invisibile
        const tmpInput = document.createElement('input');
        tmpInput.type = 'file';
        tmpInput.name = this.input.name; 
        tmpInput.multiple = true;
        tmpInput.classList.add('temp-file-input');
        tmpInput.style.display = 'none';

        const dt = new DataTransfer();
        this.filesArray.forEach(file => dt.items.add(file));
        tmpInput.files = dt.files;

        // aggiungo l'input al form
        const form = this.input.closest('form');
        if(form) form.appendChild(tmpInput);
    }
    
    addFiles(newFiles)
    {
        if (this.allowMultiple) {
            this.filesArray = this.filesArray.concat(newFiles);
        } else {
            this.filesArray = newFiles.slice(0, 1);
        }
        this.updateFileList();
    }

    updateFileList()
    {
        this.fileList.innerHTML = '';
        this.box.classList.toggle('has-files', this.filesArray.length > 0);

        this.filesArray.forEach((file, index) => {
          const item = document.createElement('div');
          item.className = 'file-item';

          if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);
            item.appendChild(img);
          }

          const name = document.createElement('span');
          name.textContent = file.name;
          item.appendChild(name);

          const removeBtn = document.createElement('span');
          removeBtn.className = 'remove-btn';
          removeBtn.textContent = '×';
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.filesArray.splice(index, 1);
            this.updateFileList();
          });
          item.appendChild(removeBtn);

          this.fileList.appendChild(item);
        });
        
        this.box.classList.toggle('has-files', this.filesArray.length > 0);
        this.syncEmptyState();
    }
  
    syncEmptyState()
    {
        const hasFiles = this.filesArray.length > 0;

        if (this.isEmpty && hasFiles) {
            this.isEmpty = false;
            this.box.dispatchEvent(new CustomEvent('filebox:nonempty', {
                bubbles: true,
                detail: { count: this.filesArray.length }
            }));
        }

        if (!this.isEmpty && !hasFiles) {
            this.isEmpty = true;
            this.box.dispatchEvent(new CustomEvent('filebox:empty', {
                bubbles: true
            }));
        }

        // opzionale ma utilissimo per CSS / debug
        this.box.dataset.state = hasFiles ? 'nonempty' : 'empty';
    }

    // Metodo statico per inizializzare tutti i box
    static initialize(selector = '.ocl-filebox')
    {
        document.querySelectorAll(selector).forEach(box => new OclFileBox(box));
    }
}

if (window.Osynapsy){
    Osynapsy.plugin.register('BclFileBox',function(){
        OclFileBox.initialize();
    });
}