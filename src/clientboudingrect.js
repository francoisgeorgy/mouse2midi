import Rx from 'rxjs/Rx';

const div = document.createElement('div');
div.style.width = '50vw';
div.style.height = '50vh';
// div.style.border = "1px solid #aaa";
div.style.border = "none";
div.style.padding = "0";
div.style.margin = "0";
div.style.backgroundColor = "#eee";
document.body.appendChild(div);



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

function getOffsetPositionSimple(e) {
    const rect = e.target.getBoundingClientRect();
    console.log(rect);
    return {
        // do not use .offsetX because this uses getBoundingClientRect.
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

const moves = Rx.Observable
    .fromEvent(div, 'mousemove')
    .map(e => getOffsetPositionSimple(e));

moves.subscribe(
    obj => {
        console.log(obj)
    },
    err => { console.log(err) },
    () => { console.log('complete') }
);
