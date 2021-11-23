import { clear } from "console";
import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";

export class Clock extends Hardware
{
    private clockListeners : ClockListener[];
    private clockInterval : number;
    private intervalHandle : NodeJS.Timeout;

    constructor(debug : boolean, interval : number)
    {
        super(0, "Clock", debug);
        this.clockListeners = new Array();
        this.clockInterval = interval;

        this.intervalHandle = setInterval(() => this.sendPulse(), this.clockInterval);

        this.log("created");
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


    //stops the clock pulse from firing
    public stopPulse() : void
    {
        clearInterval(this.intervalHandle);
    }
}