
const AUTO:number = -1;

interface ILayouter{
    /** 本身提供最终大小，layout直接返回最终大小，本身无法提供通过layout获得估算大小 */
    Layout(ui:UIObj);
    /** Layout获得估算大小后，Layout Post 确定最终大小 */
    LayoutPost(ui:UIObj,data:LayouterData);
}

class Layouter implements ILayouter{

    private static s_default = new Layouter();
    public static get Default():Layouter{
        return Layouter.s_default;
    }

    public Layout(ui:UIObj){
        ui.layoutWidth = ui.width;
        ui.layoutHeight = ui.height;
    }

    public LayoutPost(ui:UIObj,data:LayouterData){

        if(data.flexWidth != null){
            ui.calwidth = data.flexWidth;
        }
        else{
            if(ui.layoutWidth == AUTO){
                ui.calwidth = data.containerWidth;
            }
            else{
                ui.calwidth= ui.layoutWidth;
            }
        }

        if(data.flexHeight != null){
            ui.calheight = data.flexHeight;
        }
        else{
            if(ui.layoutHeight == AUTO){
                ui.calheight = data.containerHeight;
            }
            else{
                ui.calheight = ui.layoutHeight;
            }
        }
    }
}

class LayouterData{
    
    public containerWidth:number;
    public containerHeight:number;
    public flexWidth?:number;
    public flexHeight?:number;
}

//Container Fixed Size layout:done layoutpost:null
//Conatiner MainFixed SideAuto layout: calculate side

class ContainerLayouter implements ILayouter{

    private static s_default = new ContainerLayouter();
    public static get Default():ContainerLayouter{
        return ContainerLayouter.s_default;
    }

    public Layout(ui:UIObj){

        let cui = <UIContainer> ui;
        let children = cui.children;

        //FixedSize
        if(cui.width != AUTO && cui.height != AUTO){
            cui.layoutWidth= cui.width;
            cui.layoutHeight = cui.height;

            children.forEach(c=>c.onLayout());
            return;
        }

        //All auto
        if(cui.width == AUTO && cui.height == AUTO){
            if(cui.isVertical){
                cui.layoutHeight = AUTO;

                let maxwdith = AUTO;
                children.forEach(c=>{
                    c.onLayout();
                    if(c.layoutWidth != AUTO) maxwdith = Math.max(maxwdith,c.layoutWidth);
                    cui.layoutWidth = maxwdith;
                })
            }
            else{
                cui.layoutWidth = AUTO;
                let maxheight = AUTO;
                children.forEach(c=>{
                    c.onLayout();
                    if(c.layoutHeight != AUTO) maxheight = Math.max(maxheight,c.layoutHeight);
                    cui.layoutHeight = maxheight;
                })
            }

            return;
        }

        if(cui.width != AUTO){
            //height is auto
            cui.layoutWidth = cui.width;

            if(cui.isVertical){
                cui.layoutHeight = AUTO;
                children.forEach(c=>c.onLayout());
            }
            else{
                let maxheight = AUTO;
                children.forEach(c=>{
                    c.onLayout();
                    if(c.layoutHeight != AUTO) maxheight = Math.max(maxheight,c.layoutHeight);
                })
                cui.layoutHeight = maxheight;
            }
        }
        else{
            cui.layoutHeight = cui.height;
            if(cui.isVertical){
                let maxwidth = AUTO;
                children.forEach(c=>{
                    c.onLayout();
                    if(c.layoutHeight != AUTO) maxwidth= Math.max(maxwidth,c.layoutHeight);
                })
                cui.layoutWidth= maxwidth;
            }
            else{
                //TODO
            }
        }
    }

    public LayoutPost(ui:UIObj,data:LayouterData){

        let cui = <UIContainer>ui;
        let children = cui.children;


        //Fill flex
        if(data.flexWidth != null){
            cui.layoutWidth = data.flexWidth;
        }
        if(data.flexHeight != null){
            cui.layoutHeight = data.flexHeight;
        }

        //Fill auto
        if(cui.isVertical && cui.layoutWidth == AUTO){
            cui.layoutWidth = data.containerWidth;
        }
        else if(cui.layoutHeight == AUTO){
            cui.layoutHeight = data.containerHeight;
        }

        //Fixed Size
        if(cui.layoutWidth != AUTO && cui.layoutHeight != AUTO){
            cui.calwidth= cui.layoutWidth;
            cui.calheight = cui.layoutHeight;

            let cdata = new LayouterData();
            cdata.containerWidth = cui.calwidth;
            cdata.containerHeight = cui.calheight;

            children.forEach(c=>c.onLayoutPost(cdata));

            return;
        }

        //Side auto
        if(cui.isVertical){
            let cdata = new LayouterData();
            cdata.containerWidth = cui.layoutWidth;
            cdata.containerHeight = data.containerHeight;

            var maxChildWidth = 0;
            var accuChildHeight = 0;
            children.forEach(c=>{
                c.onLayoutPost(cdata);
                maxChildWidth = Math.max(maxChildWidth,c.calwidth);
                accuChildHeight += c.calheight;
            });

            if(cui.boxSideExtens){
                if(maxChildWidth < data.containerWidth){
                    cui.calwidth = data.containerWidth;
                }
                else{
                    cui.calwidth = maxChildWidth;
                }
            }
            else{
                cui.calwidth = maxChildWidth;
            }
            cui.calheight = accuChildHeight;
        }
        else{
            //symmetry as vertical
            //TODO
        }
        return;

    }
}


class FlexLayouter implements Layouter{
    private static s_default = new FlexLayouter();
    public static get Default():FlexLayouter{
        return FlexLayouter.s_default;
    }

    private AccuFlex(flex:UIFlexContainer,ui:UIObj,isvertical:boolean){

        if(ui.flex != null){
            flex.layoutFlexAccu += ui.flex;
        }
        else{
            if(isvertical){
                if(ui.layoutHeight == AUTO){
                    throw new Error();
                }else{
                    flex.layoutFlexFixedAccu += ui.layoutHeight;
                }
            }
            else{
                if(ui.layoutWidth == AUTO){
                    throw new Error();
                }
                else{
                    flex.layoutFlexFixedAccu += ui.layoutWidth;
                }
            }
        }

    }

    public Layout(ui:UIObj){
        if(!(ui instanceof UIFlexContainer)) throw new Error();
        var cui = <UIFlexContainer>ui;
        let children = cui.children;
        var self = this;

        cui.layoutWidth = cui.width;
        cui.layoutHeight = cui.height;


        cui.layoutFlexAccu = 0;
        cui.layoutFlexFixedAccu = 0;
        

        if(cui.isVertical){
            if(cui.layoutWidth == AUTO){
                let maxwidth = AUTO;
                children.forEach(c=>{
                    c.onLayout();
                    if(c.layoutWidth != AUTO){
                        maxwidth = Math.max(maxwidth,c.layoutWidth);
                    }
                    self.AccuFlex(cui,c,true);
                });
                cui.layoutWidth = maxwidth;
                return;
            }
            else{
                children.forEach(c=>{
                    c.onLayout();
                    self.AccuFlex(cui,c,true);
                });
                return;
            }
        }
        else{
            if(cui.layoutHeight == AUTO){
                let maxheight = AUTO;
                children.forEach(c=>{
                    c.onLayout();
                    if(c.layoutHeight!=AUTO){
                        maxheight= Math.max(maxheight,c.layoutHeight);
                        self.AccuFlex(cui,c,false);
                    }
                });
                cui.layoutHeight = maxheight;
                return;
            }
            else{
                children.forEach(c=>{
                    c.onLayout();
                    self.AccuFlex(cui,c,false);
                });
                return;
            }
        }

    }

    public LayoutPost(ui:UIObj,data:LayouterData){
        if(!(ui instanceof UIFlexContainer)) throw new Error();

        var cui = <UIFlexContainer>ui;
        let children = cui.children;

        //Fill flex
        if(data.flexWidth != null){
            ui.layoutWidth =data.flexWidth;
        }
        if(data.flexHeight != null){
            ui.layoutHeight = data.flexHeight;
        }

        if(ui.layoutWidth == AUTO){
            ui.layoutWidth = data.containerWidth;
        }
        if(ui.layoutHeight == AUTO){
            ui.layoutHeight = data.containerHeight;
        }

        //start flex calculate

        var sizePerFlex = 0;
        if(cui.isVertical){
            sizePerFlex = (cui.layoutHeight - cui.layoutFlexFixedAccu) / cui.layoutFlexAccu;
        }
        else{
            sizePerFlex = (cui.layoutWidth - cui.layoutFlexFixedAccu) / cui.layoutFlexAccu;
        }

        var data = new LayouterData();
        data.containerWidth = cui.layoutWidth;
        data.containerHeight = cui.layoutHeight;
        children.forEach(c=>{

            let csize =0;
            if(c.flex != null){
                csize = c.flex * sizePerFlex;   //TODO ROUND
            }
            else{
                csize = cui.isVertical ? c.layoutHeight : c.layoutWidth;
            }

            if(cui.isVertical){
                data.flexWidth = null;
                data.flexHeight = csize;
            }
            else{
                data.flexHeight = null;
                data.flexWidth = csize;
            }
            c.onLayoutPost(data);

            //calculate offset
        });

        cui.calwidth = cui.layoutWidth;
        cui.calheight = cui.layoutHeight;

    }
}

class UIObj{
    public calwidth?:number;
    public calheight?:number;

    public width:number;
    public height:number;


    public layoutWidth:number;
    public layoutHeight:number;

    public flex?:number;

    public constructor(){

    }

    public layouter: Layouter = Layouter.Default;
    public onLayout(){
        this.layouter.Layout(this);
    }

    public onLayoutPost(data:LayouterData){
        this.layouter.LayoutPost(this,data);
    }
}

class UIContainer extends UIObj{
    public isVertical:boolean;
    public boxSideExtens:boolean;

    public get isFixedSize():boolean{
        return true;
    }

    public children: UIObj[];
    public constructor(){
        super();
        this.layouter = ContainerLayouter.Default;
    }

}

class UIFlexContainer extends UIContainer{

    public layoutFlexAccu:number;
    public layoutFlexFixedAccu:number;

    public constructor(){
        super();
        this.layouter = FlexLayouter.Default;
    }
}