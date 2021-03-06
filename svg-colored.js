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
    async initSVGXML(path) {
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

    connectedCallback() {
        this.initSVGXML(this.getAttribute('path')).then(() => {
            this.innerHTML = this.svgXML;
            for (const child of this.childNodes) {
                if (child instanceof SVGElement) {
                    this.changeSvgColor(child, this.getAttribute('color'));
                }
            }
        });
    }

    static get observedAttributes() {
        return ['color'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.innerHTML.length !== 0) {
            for (const child of this.childNodes) {
                if (child instanceof SVGElement) {
                    this.changeSvgColor(child, this.getAttribute('color'));
                }
            }
        }
    }
}

customElements.define("svg-colored", SvgColored);