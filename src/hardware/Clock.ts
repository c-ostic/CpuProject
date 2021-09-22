import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";

export class Clock extends Hardware
{
    private clockListeners : ClockListener[];
    private clockInterval : number;

    constructor(interval : number)
    {
        super(0, "Clock");
        this.clockListeners = new Array();
        this.clockInterval = interval;

        setInterval(() => this.sendPulse(), this.clockInterval);
    }


    //Registers a clocklistener (adds to the list of listeners)
    //listener - the listener to be added to the list
    public register(listener : ClockListener) : void
    {
        this.clockListeners.push(listener);
    }


    //Sends a pulse to each listener in clockListeners
    public sendPulse() : void
    {
        this.log("Clock Pulse Initiated");
        for(var listener of this.clockListeners)
        {
            listener.pulse();
        }
    }
}