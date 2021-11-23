import {System} from "../System";
import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";
import { MMU } from "./MMU";

const step1 : number = 0b000001;
const step2 : number = 0b000010;
const step3 : number = 0b000100;
const step4 : number = 0b001000;
const step5 : number = 0b010000;
const step6 : number = 0b100000;
const ADD_SPACE_FMT_LEN : number = 4;
const WORD_FMT_LEN : number = 2;

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

        var previousPC : number = this.programCounter; //used for logging to show PC before fetch/decode

        if(this.instBitString == 0)             //step 0 : Fetch
        {
            this.fetch();
            this.stepCount = 0;
        }
        else if(this.instBitString & step1)     //step 1 : Decode 1
        {
            this.decode(true);
            this.instBitString &= ~step1;
            this.stepCount = 1;
        }
        else if(this.instBitString & step2)     //step 2 : Decode 2
        {
            this.decode(false);
            this.instBitString &= ~step2;
            this.stepCount = 2;
        }
        else if(this.instBitString & step3)     //step 3 : Execute 1
        {
            this.execute(true);
            this.instBitString &= ~step3;
            this.stepCount = 3;
        }
        else if(this.instBitString & step4)     //step 4 : Execute 2
        {
            this.execute(false);
            this.instBitString &= ~step4;
            this.stepCount = 4;
        }
        else if(this.instBitString & step5)     //step 5 : Write Back
        {
            this.writeBack();
            this.instBitString &= ~step5;
            this.stepCount = 5;
        }
        else if(this.instBitString & step6)     //step 6 : Interrupt Check
        {
            this.interruptCheck();
            this.instBitString &= ~step6;
            this.stepCount = 6;
        }
        else
        {
            this.log("ERROR: Invalid instruction queue. Something went wrong");
            this.instBitString = 0b00;
            this.stepCount = -1;
        }

        this.log("CPU State | PC: " + this.hexLog(previousPC, ADD_SPACE_FMT_LEN) + " IR: " + this.hexLog(this.instructionRegister, WORD_FMT_LEN)
                + " Acc: " + this.hexLog(this.accumulator, WORD_FMT_LEN) + " xReg: " + this.hexLog(this.xRegister, WORD_FMT_LEN)
                + " yReg: " + this.hexLog(this.yRegister, WORD_FMT_LEN) + " zFlag: " + (this.zFlag ? 1 : 0) + " Step: " + this.stepCount);
    }


    //step 0 : 00000000
    private fetch() : void
    {
        this._MMU.setAddressByte(this.programCounter);
        this.instructionRegister = this._MMU.read();
        this.programCounter++;

		this.instBitString = step1; //force the next cycle to decode
        //this.log("Fetch");
    }


    //steps 1 and 2 : 00000011
    private decode(isFirst : boolean) : void
    {
        /*Bit String explanation
        Each of the last six bits of the instBitString variable represent one of the CPU steps (except for fetch)
        During the decode step, this bitString is "filled" (with 1s) to queue up specific steps according to the instruction in the IR
        After each step, the corresponding bit is flipped to 0 to show the CPU does not need to run that step again
        The pulse method if-else block tests for each bit in order to determine what step to take next
        At the end, the instBitString is empty, which corresponds to the fetch step for the next instruction cycle
        */

        switch(this.instructionRegister)
        {
            case 0x00:
            {
                this._System.stopSystem();
                break;
            }
            case 0xA9:
            {
                this._MMU.setAddressByte(this.programCounter);
                this.accumulator = this._MMU.read();
                this.instBitString = 0b100000;
                break;
            }
            default:
            {
                this.log("Something I don't know is here")
            }
        }

        this.programCounter++;
        //this.log("Decode " + isFirst);
    }


    //steps 3 and 4 : 00001100
    private execute(isFirst : boolean) : void
    {
        //this.log("Execute " + isFirst);
    }


    //step 5 : 00010000
    private writeBack() : void
    {
        //this.log("Write Back");
    }


    //step 6 : 00100000
    private interruptCheck() : void
    {
        //this.log("InterruptCheck");
    }
}
