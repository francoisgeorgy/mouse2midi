import Rx from 'rxjs/Rx';

const div = document.getElementById("container");

/*
const div = document.createElement('div');
div.style.width = '50vw';
div.style.height = '50vh';
// div.style.border = "1px solid #aaa";
div.style.border = "none";
div.style.padding = "0";
div.style.margin = "0";
div.style.backgroundColor = "#eee";
document.body.appendChild(div);

const NS = "http://www.w3.org/2000/svg";
const svg_element = document.createElementNS(NS, "svg");
svg_element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
svg_element.setAttributeNS(null, "viewBox", '0 0 100 100');
svg_element.setAttributeNS(null, "width", '100%');
svg_element.setAttributeNS(null, "height", '100%');
 */

let r = div.getBoundingClientRect();
console.log(r);
/* 
const svg_dot = document.createElementNS(NS, "circle");
// svg_dot.setAttributeNS(null, "cx", r.width / 2);
// svg_dot.setAttributeNS(null, "cy", r.height / 2);
svg_dot.setAttributeNS(null, "cx", 10);
svg_dot.setAttributeNS(null, "cy", 10);
svg_dot.setAttributeNS(null, "r", '10');
svg_dot.setAttribute("fill", 'black');
svg_element.appendChild(svg_dot);

div.appendChild(svg_element);

svg_element.setAttribute("x", 100);
 */
/*
function getOffsetPosition(e) {
    if (e.offsetX === undefined) {
        const rect = e.target.getBoundingClientRect();
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
*/

const svg_dot = document.getElementById("dot");

function getOffsetPositionSimple(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    console.log(e, rect);
    return {
        // do not use .offsetX because this uses getBoundingClientRect.
        x: (e.clientX - rect.left) / rect.width * 100,
        y: (e.clientY - rect.top) / rect.height * 100
    }
}

const moves = Rx.Observable
    .fromEvent(div, 'mousemove')
    .map(e => getOffsetPositionSimple(e));

moves.subscribe(
    obj => {
        console.log(obj);
        svg_dot.setAttributeNS(null, "cx", obj.x);
        svg_dot.setAttributeNS(null, "cy", obj.y);
    },
    err => { console.log(err) },
    () => { console.log('complete') }
);
