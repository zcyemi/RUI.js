
const AUTO:number = -1;

interface ILayouter{
    /** 本身提供最终大小，layout直接返回最终大小，本身无法提供通过layout获得估算大小 */
    Layout(ui:UIObj);
    /** Layout获得估算大小后，Layout Post 确定最终大小 */
    LayoutPost(ui:UIObj);
}

class Layouter implements ILayouter{

    private static s_default = new Layouter();
    public static get Default():Layouter{
        return Layouter.s_default;
    }

    public Layout(ui:UIObj){

    }

    public LayoutPost(ui:UIObj){

    }
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

        //FixSize
        if(cui.isFixedSize){
            
            children.forEach(f=>{
                f.onLayout();
                f.onLayoutPost();
            })

            //set fixed size;
            cui.calwidth = 0;
            cui.calheight = 0;
            return;
        }

        let fixedWidth = true;
        let fixedHeight = false;
        if(cui.isVertical){
            if(fixedWidth){

                children.forEach(f=>{

                    f.onLayout();
                    f.onLayoutPost();

                    //accumulate height
                })

                //set current size;
                cui.calwidth = 0;
                cui.calheight = 0;

                return;
            }
            else if(fixedHeight){

                children.forEach(f=>{
                    f.onLayout();
                    //accumulate width
                })

                children.forEach(f=>{
                    f.onLayoutPost();// set accumulate calculated width;
                });

                //set current size

                return;
            }
            //all not fixed
        }
        else{

            //the same as former

            if(fixedHeight){

                return;
            }else if(fixedWidth){
                
                return;
            }
            //all not fixed
        }

        ////all not fixed

        if(cui.isVertical){
        }

        
    }

    public LayoutPost(ui:UIObj){

    }
}

class UIObj{


    public calwidth?:number;
    public calheight?:number;

    public constructor(){

    }

    public layouter: Layouter = Layouter.Default;
    public onLayout(){
        this.layouter.Layout(this);
    }

    public onLayoutPost(){
        this.layouter.LayoutPost(this);
    }
}

class UIContainer extends UIObj{


    public isVertical:boolean;

    public get isFixedSize():boolean{
        return true;
    }

    public children: UIObj[];
    public constructor(){
        super();
        this.layouter = ContainerLayouter.Default;
    }

}


