var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("rui/RUICanvas", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var RUICanvas = /** @class */ (function () {
        function RUICanvas(canvas) {
            this.m_canvas = canvas;
        }
        return RUICanvas;
    }());
    exports.RUICanvas = RUICanvas;
});
define("rui/UIObject", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var UIObject = /** @class */ (function () {
        function UIObject() {
        }
        return UIObject;
    }());
    exports.UIObject = UIObject;
});
define("rui/UIButton", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_1) {
    "use strict";
    exports.__esModule = true;
    var UIButton = /** @class */ (function (_super) {
        __extends(UIButton, _super);
        function UIButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UIButton;
    }(UIObject_1.UIObject));
    exports.UIButton = UIButton;
});
