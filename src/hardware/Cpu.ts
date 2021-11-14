import {System} from "../System";
import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";
import { MMU } from "./MMU";

export class Cpu extends Hardware implements ClockListener
{
    private _MMU : MMU;
    private _System : System
    private cpuClockCount : number;
    private programCounter : number;
    private zFlag : boolean;

    //registers
    private instructionRegister : number;
    private accumulator : number;
    private xRegister: number;
    private yRegister: number;

    //cycle step variables
    private instBitString : number; //used to "queue" instructions and know which step comes next (see decode method)
    private stepCount : number; //used for logging purposes

    //used for temporarily storing additional operands before being used in future cycles
    private firstOperand : number;
    private secondOperand : number;

    constructor(debug : boolean, system : System, mmu : MMU) 
    {
        super(0, "CPU", debug);
        this._System = system;
        this._MMU = mmu;
        this.cpuClockCount = 0;
        this.programCounter = 0x00;
        this.zFlag = false;
        this.instructionRegister = 0x00;
        this.accumulator = 0x00;
        this.xRegister = 0x00;
        this.yRegister = 0x00;
        this.instBitString = 0b00;
        this.stepCount = 0;
        this.firstOperand = 0x00;
        this.secondOperand = 0x00;

        this.log("created");
    }
    

    public pulse() : void
    {
        this.cpuClockCount++;
        this.log("recieved clock pulse - CPU Clock Count: " + this.cpuClockCount)
    }


    //step 0 : 00000000
    private fetch() : void
    {

    }


    //steps 1 and 2 : 00000011
    private decode(isFirst : boolean) : void
    {

    }


    //steps 3 and 4 : 00001100
    private execute(isFirst : boolean) : void
    {
        
    }


    //step 5 : 00010000
    private writeBack() : void
    {

    }


    //step 6 : 00100000
    private interruptCheck() : void
    {

    }
}
