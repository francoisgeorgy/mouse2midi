import Rx from 'rxjs/Rx';

export default () => {

    console.log('App starting...');

    // const div = document.createElement('div');
    // div.style.width = '200px';
    // div.style.height = '200px';
    // document.body.appendChild(div);

    let info = document.getElementById('position');

    let pad = document.getElementById("pad");
    // console.log(pad);

    // let marker = document.getElementById("marker");
    let dot = document.getElementById("dot");

/*
    const NS = "http://www.w3.org/2000/svg";

    const svg_element = document.createElementNS(NS, "svg");
    svg_element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg_element.setAttributeNS(null, "viewBox", '0 0 100 100');

    const svg_rect = document.createElementNS(NS, "rect");
    svg_rect.setAttributeNS(null, "x", '0');
    svg_rect.setAttributeNS(null, "y", '0');
    svg_rect.setAttributeNS(null, "width", '100');
    svg_rect.setAttributeNS(null, "height", '100');
    svg_rect.setAttribute("fill", 'none');
    svg_rect.setAttribute("stroke", '#555555');
    svg_rect.setAttribute("stroke-width", '1');
    svg_element.appendChild(svg_rect);

    const svg_grid = document.createElementNS(NS, "path");
    svg_grid.setAttributeNS(null, "d", 'M 0 50 L 100 50 M 50 0 L 50 100');
    svg_grid.setAttribute("stroke", '#555555');
    svg_grid.setAttribute("stroke-width", '1');
    svg_element.appendChild(svg_grid);

    pad.appendChild(svg_element);
*/

    const rect = pad.getBoundingClientRect();
    console.log(rect);

    function getOffsetPosition(e) {
        // http://www.jacklmoore.com/notes/mouse-position/
        if (e.offsetX === undefined) {
            // const rect = e.target.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        } else {
            return {
                x: e.offsetX,
                y: e.offsetY
            }
        }
    }

    function getOffsetPositionPercents(e) {
        // const rect = e.target.getBoundingClientRect();
        if (e.offsetX === undefined) {
            return {
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height
            }
        } else {
            return {
                x: (e.offsetX) / rect.width,
                y: (e.offsetY) / rect.height
            }
        }
    }

    const moves = Rx.Observable.fromEvent(pad, 'mousemove');

    // Use the map operator to transform the event object to just the x and y coordinates of the mouse
    const transform = moves.map(
        e => {
            let p = getOffsetPositionPercents(e);
            // console.log(`${e.clientX} ${e.clientY} ${p.x} ${p.y}`);
            console.log(e);
            return p;
        }
    );

    // Subscribe to the transformed Observable
    transform.subscribe(
        obj => {
            console.log('one', obj);
            // pad.style.backgroundColor = `rgb(${Math.round(obj.x * 255)}, ${Math.round(obj.y * 255)}, 128)`
            info.textContent = `${obj.x.toFixed(2)}, ${obj.y.toFixed(2)}`;

            // marker.setAttributeNS(null, "transform", `translate(${obj.x * 100},${obj.y * 100})`);
            dot.setAttributeNS(null, "cx", `${obj.x * 100}`);
            dot.setAttributeNS(null, "cy", `${obj.y * 100}`);

        },
        err => {
            console.log(err)
        },
        () => {
            console.log('complete')
        }
    );

    transform.subscribe(
        obj => {
            console.log('two', obj);
        },
        err => {
            console.log(err)
        },
        () => {
            console.log('complete')
        }
    );

}