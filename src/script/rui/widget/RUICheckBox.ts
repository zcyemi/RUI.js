import {RUIObject} from "../RUIObject";
import {RUIAlign, RUIUtil} from "../RUIUtil";
import {RUICmdList} from "../RUICmdList";
import {RUIStyle} from "../RUIStyle";
import {RUIContainer} from "../RUIContainer";
import {RUIRectangle} from "../RUIRectangle";
import {RUIEventEmitter} from "../RUIEvent";
import { RUIPosition, RUIAuto } from "../RUIDefine";

const CHECKBOX_SIZE = 15;
const CHECKBOX_SIZE2X = CHECKBOX_SIZE * 2;

class RUICheckBoxInner extends RUIObject {

    private m_checked : boolean;

    public readonly EventOnClick : RUIEventEmitter < boolean > = new RUIEventEmitter();

    public constructor(checked : boolean) {
        super();
        this.width = CHECKBOX_SIZE;
        this.height = CHECKBOX_SIZE;
        this.m_checked = checked;
    }

    public get checked() : boolean {return this.m_checked;}

    public set checked(c : boolean) {
        if (c == this.m_checked) 
            return;
        this.m_checked = c;
        this.setDirty();
    }

    public onMouseClick() {
        let checked = !this.checked;
        this.checked = checked;
        this
            .EventOnClick
            .emitRaw(checked);
    }

    public onDraw(cmd : RUICmdList) {
        super.onDraw(cmd);

        let cliprect = this._drawClipRect;
        if (cliprect == null) {
            return;
        }

        let rect = this._rect;

        cmd.DrawBorder(rect, RUIStyle.Default.primary0, cliprect);

        if (this.m_checked) {
            let crect = RUIUtil.RectIndent(rect, 2);
            cmd.DrawRectWithColor(crect, RUIStyle.Default.primary, cliprect);
        }
    }
}

export class RUICheckBox extends RUIContainer {

    private m_align : RUIAlign = RUIUtil.ALIGN_CENTER;
    private m_inner : RUICheckBoxInner;

    public get EventOnClick() : RUIEventEmitter < boolean > {
        return this.m_inner.EventOnClick;
    }

    public get isChecked() : boolean {return this.m_inner.checked;}
    public set isChecked(c : boolean) {
        this.m_inner.checked = c;
    }

    public constructor(checked : boolean, align : RUIAlign = RUIUtil.ALIGN_CENTER) {
        super();
        this.height = RUIUtil.LINE_HEIGHT_DEFAULT;

        let inner = new RUICheckBoxInner(checked);
        inner.position = RUIPosition.Relative;
        this.m_inner = inner;
        this.addChild(inner);

        this.updateAlign(align);
    }

    private updateAlign(align : RUIAlign) {
        if (align == this.m_align) 
            return;
        this.m_align = align;

        let inner = this.m_inner;
        if (align == RUIUtil.ALIGN_CENTER) {
            inner.left = RUIAuto;
            inner.right = RUIAuto;
        } else if (align = RUIUtil.ALIGN_LEFT) {
            inner.right = RUIAuto;
            inner.left = CHECKBOX_SIZE;
        } else {
            inner.right = CHECKBOX_SIZE;
            inner.left = RUIAuto;
        }

        this.setDirty();
    }
}