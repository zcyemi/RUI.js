export function BIND_EMITTER(property: string) {
    return '_ruibind$' + property;
}
type BindFunc = (t: any) => void;
export function RUIBind(tar: any, property: string, f: (t: any) => void) {
    if (f == null) return;

    var identifier = BIND_EMITTER(property);
    let emitter = <BindFunc[]>tar[identifier];

    if (emitter == undefined) {
        emitter = [f];
        tar[identifier] = emitter;
        let descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(tar), property);
        if (descriptor != null) {
            var getter: any = descriptor.get;
            var setter: any = descriptor.set;
            if (getter == null || setter == null) return;
            Object.defineProperty(tar, property, {
                enumerable: descriptor.enumerable,
                get: function () {
                    return getter.call(tar);
                },
                set: function (newval) {
                    setter.call(tar, newval);
                    let val = tar[property];
                    tar[identifier].forEach(f => {
                        f(val);
                    });
                }
            })
        }
        else {
            var value = tar[property];
            Object.defineProperty(tar, property, {
                enumerable: true,
                get: function () {
                    return value;
                },
                set: function (newval) {
                    value = newval;
                    let val = tar[property];
                    tar[identifier].forEach(f => {
                        f(val);
                    });
                }
            })
        }
    }
    else {
        if (emitter.indexOf(f) >= 0) {
            console.warn('function alread binded');
            return;
        }
        else {
            emitter.push(f);
        }
    }
}