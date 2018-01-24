import Rx from 'rxjs/Rx';

const infos = document.createElement('div');
infos.innerHTML = "&nbsp;";
document.body.appendChild(infos);
console.log('infos created');

const div = document.createElement('div');
div.style.width = '200px';
div.style.height = '200px';
div.style.border = "1px solid #aaa";
document.body.appendChild(div);
console.log('div created');

const mouseDowns = Rx.Observable.fromEvent(div, "mousedown");
const mouseMoves = Rx.Observable.fromEvent(window, "mousemove");
const mouseUps = Rx.Observable.fromEvent(window, "mouseup");

const touchStarts = Rx.Observable.fromEvent(div, "touchstart");
const touchMoves = Rx.Observable.fromEvent(div, "touchmove");
const touchEnds = Rx.Observable.fromEvent(window, "touchend");

const starts = mouseDowns.merge(touchStarts);
const moves = mouseMoves.merge(touchMoves);
const ends = mouseUps.merge(touchEnds);

// Once a start event occurs, it does not give back the start event itself,
// but it only return a sequence of move events till a mouseUp or touchEnd event occurs.
const drags = starts.concatMap(dragStartEvent =>
    moves.takeUntil(ends).map(dragEvent => {
        const x = dragEvent.x; // - dragStartEvent.x;
        const y = dragEvent.y; // - dragStartEvent.y;
        // console.log(`drags ${x} ${y}`);
        return {x, y};
    })
);

// Reveals the first end event once a start event happened.
// "ends.first()" part here will not give back a sequence of end events once once a start event occurs,
// but it gives back only the first one.
const drops = starts.concatMap(dragStartEvent =>
    ends.first().map(dragEndEvent => {
        const x = dragEndEvent.x; // - dragStartEvent.x;
        const y = dragEndEvent.y; // - dragStartEvent.y;
        // console.log(`drops ${x} ${y}`);
        return {x, y};
    })
);

drags.subscribe(
    obj => { infos.innerText = `drag ${obj.x}, ${obj.y}`},
    err => { console.log(err) },
    () => { console.log('complete') }
);

drops.subscribe(
    obj => { infos.innerText = `drop ${obj.x}, ${obj.y}`},
    err => { console.log(err) },
    () => { console.log('complete') }
);
