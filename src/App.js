import Rx from 'rxjs/Rx';

export default () => {

    console.log('App starting...');

    // const div = document.createElement('div');
    // div.style.width = '200px';
    // div.style.height = '200px';
    // document.body.appendChild(div);

    let info = document.getElementById('position');
    let pad = document.getElementById("pad");

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

    var rect = pad.getBoundingClientRect(); // will be update on resize events
    console.log(rect);
/*
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
*/

    function updateDisplay(p) {
        info.textContent = `${p.x.toFixed(2)}, ${p.y.toFixed(2)} rel: ${p.xr.toFixed(2)}, ${p.yr.toFixed(2)}`;
        dot.setAttributeNS(null, "cx", `${p.xr * 100}`);
        dot.setAttributeNS(null, "cy", `${p.yr * 100}`);
    }

    // currentTarget: Identifies the current target for the event, as the event traverses the DOM. 
    //                It always refers to the element to which the event handler has been attached, 
    //                as opposed to event.target which identifies the element on which the event occurred.
    //
    // target: A reference to the target to which the event was originally dispatched.
    //         A reference to the object that dispatched the event. It is different from event.currentTarget 
    //         when the event handler is called during the bubbling or capturing phase of the event.
    //
    // MouseEvent.offsetX: The X coordinate of the mouse pointer relative to the position of the padding edge of the target node.

    // Important: we can not use the targetX, targetY properties, which are related to the _target_, because, since we listen to the
    //            window's mousemove events, the target will change and therefore the offsetX|Y reference will also change.

    function mouseEventToCoordinate(e) {        
        e.preventDefault();
        // console.log(`move ${mouseEvent.offsetX} ${mouseEvent.offsetY}`);
        console.log(`mouse->xy ${e.currentTarget.id}, ${e.target.id}`, e);
        return {
            // x: mouseEvent.clientX,
            // y: mouseEvent.clientY
            // x: mouseEvent.offsetX,
            // y: mouseEvent.offsetY
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function touchEventToCoordinate(touchEvent) {
        touchEvent.preventDefault();
        return {
            x: touchEvent.changedTouches[0].clientX - rect.left,
            y: touchEvent.changedTouches[0].clientY - rect.top
        };
    }

    function toRelCoord(coord) {
        let x = Math.max(0, coord.x); // stop at 0, do not go negative
        let y = Math.max(0, coord.y); // stop at 0, do not go negative
        return {
            x: x,
            y: y,
            xr: Math.min(x / rect.width, 1.0),
            yr: Math.min(y / rect.height, 1.0)
        }
    }

    function start(e) {
        const x = e.x;
        const y = e.y;
        console.log(`start at ${x} ${y} (${e.xr} ${e.yr})`, e);
        updateDisplay(e);
        return e;
    }

    // function logXY(e) {
    //     console.log(e);
    //     let c = toRelCoord({x, y});
    //     return e;
    // }

    const mouseDowns = Rx.Observable.fromEvent(pad, "mousedown").map(mouseEventToCoordinate).map(toRelCoord);
    const mouseMoves = Rx.Observable.fromEvent(window, "mousemove").map(mouseEventToCoordinate).map(toRelCoord);
    const mouseUps = Rx.Observable.fromEvent(window, "mouseup").map(mouseEventToCoordinate).map(toRelCoord);

    const touchStarts = Rx.Observable.fromEvent(pad, "touchstart").map(touchEventToCoordinate).map(toRelCoord);
    const touchMoves = Rx.Observable.fromEvent(pad, "touchmove").map(touchEventToCoordinate).map(toRelCoord);
    const touchEnds = Rx.Observable.fromEvent(window, "touchend").map(touchEventToCoordinate).map(toRelCoord);

    const starts = mouseDowns.merge(touchStarts);
    const moves = mouseMoves.merge(touchMoves);
    const ends = mouseUps.merge(touchEnds);

    // Once a start event occurs, it does not give back the start event itself,
    // but it only return a sequence of move events till a mouseUp or touchEnd event occurs.
    const drags = starts.map(start).concatMap(dragStartEvent =>
        moves.takeUntil(ends).map(dragEvent => {
            const x = dragEvent.x;
            const y = dragEvent.y;
            const xr = dragEvent.xr;
            const yr = dragEvent.yr;
            console.log(`drags ${x} ${y}`);
            return {x, y, xr, yr};
        })
    );
    
    // Reveals the first end event once a start event happened.
    // "ends.first()" part here will not give back a sequence of end events once once a start event occurs,
    // but it gives back only the first one.
    const drops = starts.concatMap(dragStartEvent =>
        ends.first().map(dragEndEvent => {
            const x = dragEndEvent.x; // - dragStartEvent.x;
            const y = dragEndEvent.y; // - dragStartEvent.y;
            const xr = dragEndEvent.xr; // - dragStartEvent.x;
            const yr = dragEndEvent.yr; // - dragStartEvent.y;
            console.log(`drops ${x} ${y}`);
            return {x, y, xr, yr};
        })
    );

    drags.subscribe(
        // obj => { infos.innerText = `drag ${obj.x}, ${obj.y}`},
        updateDisplay,
        err => { console.log(err) },
        () => { console.log('complete') }
    );

    drops.subscribe(
        //obj => { infos.innerText = `drop ${obj.x}, ${obj.y}`},
        updateDisplay,
        err => { console.log(err) },
        () => { console.log('complete') }
    );



    const resizes = Rx.Observable.fromEvent(window, "resize");
    resizes.subscribe(
        e => {
            console.log(e);
            rect = pad.getBoundingClientRect();
        }
    );

    /*
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
*/

}