export interface Interrupt
{
    //identifying data
    irq : number;
    intrptName : string;

    //the priority of the interrupter (1 is lowest)
    priority : number;

    //storage of input and output data
    outputBuffer : any;
    inputBuffer : any;

    //start listening to interrupts from this hardware
    listen() : void;

    //execute the current interrupt
    execute() : void;
}