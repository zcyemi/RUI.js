
export function RUIBind(tar: any, property: string, f: (t: any) => void) {
    if (f == null) return;
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
                f(tar[property]);
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
                f(value);
            }
        })
    }
}