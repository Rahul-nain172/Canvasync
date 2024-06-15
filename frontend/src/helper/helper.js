const cal=(from,x,y,pressedShift)=>{
    let width=(x-from[0]),height=(y-from[1]);
    if(pressedShift){
        let mn=Math.min(Math.abs(width),Math.abs(height));
        if(width<0)width=-mn;
        else width=mn;
        if(height<0)height=-mn;
        else height=mn;

        return {height,width};
    }
    return {height,width};

}
export const drawLine=(Context,from,x,y,pressedShift)=>{
    if(pressedShift){
        Context.beginPath();
        Context.lineTo(from[0],from[1]);
        Context.lineTo(x,y);
        Context.stroke();
        Context.closePath();
    }
    else{
        Context.lineTo(x,y);
        Context.stroke();
    }
}
export const drawRect=(Context,from,x,y,shift,fill)=>{
    const {width,height}=cal(from,x,y,shift);
    Context.beginPath();
    if(fill)Context.fillRect(from[0], from[1], width, height);
    else Context.rect(from[0], from[1], width, height);
    Context.stroke();
    Context.closePath();
    return {width,height};
}
export const drawCircle=(Context,from,x,y,shift)=>{
    const {width,height}=cal(from,x,y,shift);
    const cX=from[0]+width/2;
    const cY=from[1]+height/2;
    Context.beginPath();
    Context.ellipse(cX,cY,Math.abs(width/2),Math.abs(height/2),0,0,2*Math.PI);
    Context.stroke();
   // Context.fill();
    Context.closePath();
    const rX=Math.abs(width/2),rY=Math.abs(height/2);
    return {cX,cY,rX,rY };
}