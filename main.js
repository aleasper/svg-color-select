const SVG_IMG_PATH = './assets/img.svg';
const IMAGE_WRAPPER_ID = 'image-wrapper';

let color = {
    value: '#000000',
    toString: function() {
        return this.value;
    }
};


/**
 * Get XML tags in string by svg full path
 * @param {string} path
 * @return {Promise<string>}
 */
const getSvgText = async (path) => {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", path, true);
    ajax.send();
    return new Promise((resolve, reject) => {
        ajax.onload = function(e) {
            resolve(ajax.responseText);
        }
    });
}

/**
 * Covert hex to rgba format
 * @param {string} hex
 * @param {number} alpha
 * @return {`rgba(${*},${*},${*},${alpha})`}
 */
const hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

document.addEventListener("DOMContentLoaded", async () => {
    const svgStr = await getSvgText(SVG_IMG_PATH);
    document.getElementById(IMAGE_WRAPPER_ID).innerHTML = svgStr;
    changeSvgColor(color);
});

const changeSvgColor = (color) => {
    const svg = document.getElementById(IMAGE_WRAPPER_ID).querySelector('svg');

    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');

    for (const child of svg.childNodes) {
        if (child instanceof SVGElement) {
            const childWidth = child.getAttribute('width');
            const childHeight = child.getAttribute('height');
            let svgColor = color.value;
            if (width === childWidth && height === childHeight) {
                svgColor = hex2rgba(svgColor, 0.2);
            }
            child.setAttribute('fill', svgColor)
        }
    }
}


color = new Proxy(color, {
    set(target, prop, val, receiver) {
        if (prop in target) {
            target[prop] = val;
            changeSvgColor(target)
            return true;
        }
        return false;
    },
    get(target, prop) {
        if (prop in target) {
            return target[prop];
        } else {
            return undefined;
        }
    }
});


['input'].forEach( evt =>
    document.getElementById('image-color-picker').addEventListener(evt, (event, v) => {
        color.value = event.target.value;
    }, false)
);