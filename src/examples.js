import Rx from 'rxjs/Rx';

const div = document.createElement('div');
div.style.width = '200px';
div.style.height = '200px';
div.style.border = "1px solid #aaa";
document.body.appendChild(div);

/*
 * BASIC
 *

    const moves = Rx.Observable.fromEvent(div, 'mousemove');


    // Subscribe to the transformed Observable
    transform.subscribe(
        obj => { div.style.backgroundColor = `rgb(${obj.x}, ${obj.y}, 100)`},
        err => { console.log(err) },
        () => { console.log('complete') }
    );

*/



/*
 * SITH A SUBJECT
 *

    const moves = Rx.Observable.fromEvent(div, 'mousemove');

    // const positions = moves.map(x => ({ x: x.clientX, y: x.clientY })).throttle(ev => Rx.Observable.interval(1000));
    const positions = moves.map(x => ({ x: x.clientX, y: x.clientY })).throttleTime(50);


    // Subjects are the only way of making any Observable execution be shared to multiple Observers.
    // (src: http://reactivex.io/rxjs/manual/overview.html#subject)
    var subject = new Rx.Subject();

    subject.subscribe({
        next: (v) => console.log('observerA: ', v)
    });
    subject.subscribe({
        next: (v) => console.log('observerB: ', v)
    });


    positions.subscribe(subject); // You can subscribe providing a Subject

*/

/*
 * MULTICASTED OBSERVABLES WITH REFERENCE COUNTING
 *

    console.log('MULTICASTED OBSERVABLES WITH REFERENCE COUNTING');

    const moves = Rx.Observable.fromEvent(div, 'mousemove');

    // const positions = moves.map(x => ({ x: x.clientX, y: x.clientY })).throttle(ev => Rx.Observable.interval(1000));
    const positions = moves.map(x => ({ x: x.clientX, y: x.clientY })).throttleTime(50);

    // Subjects are the only way of making any Observable execution be shared to multiple Observers.
    // (src: http://reactivex.io/rxjs/manual/overview.html#subject)
    // var subject = ;
    var subject = positions.multicast(new Rx.Subject()).refCount();

    subject.subscribe({
        next: (v) => console.log('observerA: ', v)
    });
    subject.subscribe({
        next: (v) => console.log('observerB: ', v)
    });

*/

/*
 * SHARED OBSERVABLES
 */

    console.log('SHARED OBSERVABLES');

    const positions = Rx.Observable
        .fromEvent(div, 'mousemove')
        .map(x => ({ x: x.clientX, y: x.clientY }))
        .throttleTime(50)
        .share();   // alias for .publish().refCount().

    positions.subscribe({ next: (v) => console.log('A: ', v) });
    positions.subscribe({ next: (v) => console.log('B: ', v) });

