class OclFileBox 
{
    constructor(element)
    {
        this.box = element;
        this.input = this.box.querySelector('input[type="file"]');
        this.fileList = this.box.querySelector('.file-list');
        this.filesArray = [];

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
        this.filesArray = this.filesArray.concat(Array.from(this.input.files));
        this.updateFileList();
        this.input.value = '';
    }

    updateFileList()
    {
        this.fileList.innerHTML = '';
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
            removeBtn.addEventListener('click', () => {
                e.stopPropagation();
                this.filesArray.splice(index, 1);
                this.updateFileList();
            });
            item.appendChild(removeBtn);

            this.fileList.appendChild(item);
        });
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