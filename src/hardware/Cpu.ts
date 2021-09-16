import {System} from "../System";
import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";

export class Cpu extends Hardware implements ClockListener
{
    private cpuClockCount : number;

    constructor() 
    {
        super(0, "CPU");
        this.cpuClockCount = 0;     
    }
    

    public pulse() : void
    {
        this.cpuClockCount++;
        this.log("recieved clock pulse - CPU Clock Count: " + this.cpuClockCount)
    }
}
