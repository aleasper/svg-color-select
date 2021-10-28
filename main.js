['input'].forEach( evt =>
    document.getElementById('image-color-picker').addEventListener(evt, (event, v) => {
        document.getElementById('test').setAttribute('color', event.target.value);
    }, false)
);

['input'].forEach( evt =>
    document.getElementById('image-color-picker2').addEventListener(evt, (event, v) => {
        document.getElementById('test2').setAttribute('color', event.target.value);
    }, false)
);