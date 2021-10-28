const hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

class SvgColored extends HTMLElement {
    constructor() {
        super();
        this.svgXML = '';
    }
    async getSvgText(path) {
        const ajax = new XMLHttpRequest();
        ajax.open("GET", path, true);
        ajax.send();
        return new Promise((resolve, reject) => {
            ajax.onload = function(e) {
                resolve(ajax.responseText);
            }
        });
    }
    async init(path) {
        this.svgXML = await this.getSvgText(path);
    }

    changeSvgColor (svgElement, color) {
        const width = svgElement.getAttribute('width');
        const height = svgElement.getAttribute('height');

        for (const child of svgElement.childNodes) {
            if (child instanceof SVGElement) {
                const childWidth = child.getAttribute('width');
                const childHeight = child.getAttribute('height');
                let svgColor = color;
                if (width === childWidth && height === childHeight) {
                    svgColor = hex2rgba(svgColor, 0.2);
                }
                if (child.getAttribute('fill')) {
                    child.setAttribute('fill', svgColor);
                }
                if (child.getAttribute('stroke')) {
                    child.setAttribute('stroke', svgColor);
                }
            }
        }
    }

    render() {
        if (!this.inited) {
            this.inited = true;
            this.init(this.getAttribute('path')).then(() => {
                this.innerHTML = this.svgXML;
                this.DOMLoaded = true;
                for (const child of this.childNodes) {
                    if (child instanceof SVGElement) {
                        console.log(child);
                        this.changeSvgColor(child, this.getAttribute('color'));
                        break;
                    }
                }
            });
            return;
        }
        if (this.DOMLoaded) {
            for (const child of this.childNodes) {
                if (child instanceof SVGElement) {
                    this.changeSvgColor(child, this.getAttribute('color'));
                    break;
                }
            }
        }
    }

    connectedCallback() {
        // браузер вызывает этот метод при добавлении элемента в документ
        // (может вызываться много раз, если элемент многократно добавляется/удаляется)
        console.log('connectedCallback');
        if (!this.rendered) {
            this.rendered = true;
            this.render();
        }
    }

    disconnectedCallback() {
        // браузер вызывает этот метод при удалении элемента из документа
        // (может вызываться много раз, если элемент многократно добавляется/удаляется)
    }

    static get observedAttributes() {
        return ['color'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback');
        // вызывается при изменении одного из перечисленных выше атрибутов
        this.render();
    }

    adoptedCallback() {
        // вызывается, когда элемент перемещается в новый документ
        // (происходит в document.adoptNode, используется очень редко)
    }
}

customElements.define("svg-colored", SvgColored);

// setTimeout(() => {
//     document.getElementById('test').setAttribute('color', '#000000');
// }, 3000)

['input'].forEach( evt =>
    document.getElementById('image-color-picker').addEventListener(evt, (event, v) => {
        document.getElementById('test').setAttribute('color', event.target.value);
    }, false)
);