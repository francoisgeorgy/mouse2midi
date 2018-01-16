import Rx from 'rxjs/Rx';

export default () => {

    console.log('App starting...');

    const div = document.createElement('div');
    div.style.width = '200px';
    div.style.height = '200px';
    document.body.appendChild(div);

    const rect = div.getBoundingClientRect();
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

    const moves = Rx.Observable.fromEvent(div, 'mousemove');

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
            div.style.backgroundColor = `rgb(${Math.round(obj.x * 255)}, ${Math.round(obj.y * 255)}, 128)`
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