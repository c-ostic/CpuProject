import { Hardware } from "./Hardware";
import { Interrupt } from "./imp/Interrupt";

export class InterruptController extends Hardware
{
    private interruptHardware : Interrupt[]
    private interrupts : Interrupt[]

    constructor(debug : boolean)
    {
        super(0, "IC", debug);
        this.interruptHardware = new Array();
        this.interrupts = new Array();
        this.log("Created");
    }

    //register an interrupt hardware to the controller
    //NOTE: this is different from adding an interrupt to the queue
    public registerInterrupt(intrpt : Interrupt)
    {
        this.interruptHardware.push(intrpt);
    }

    //start the listeners on each registered interrupt
    public startListen() : void
    {
        this.log("Starting listeners");
        for(var intrpt of this.interruptHardware)
        {
            intrpt.listen();
        }
    }

    //returns the priority of the next interrupt
    //returns 0 if there are none
    //called by the CPU
    public hasInterrupt() : number
    {
        if(this.interrupts.length == 0)
            return 0;
        else
        {
            this.interrupts.sort((a,b) => b.priority - a.priority);
            return this.interrupts[0].priority;
        }
    }

    //pushes an interrupt into the queue
    //called by Interrupts
    public acceptInterrupt(intrpt : Interrupt)
    {
        this.interrupts.push(intrpt);
    }

    //returns the interrupt at the start of the queue
    //called by the CPU after calling hasInterrupt
    public getInterrupt() : Interrupt
    {
        return this.interrupts.shift();
    }
}