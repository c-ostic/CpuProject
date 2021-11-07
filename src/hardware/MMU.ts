import { Hardware } from "./Hardware";
import { Memory } from "./Memory";

const ADD_SPACE_FMT_LEN : number = 4;
const WORD_FMT_LEN : number = 2;

export class MMU extends Hardware
{
    private _RAM : Memory;

    constructor(debug : boolean, ram : Memory)
    {
        super(0, "MMU", debug);
        this._RAM = ram;

        this.log("created");
    }

    /*
    Sets the MAR of memory depending on what the CPU sends (full address, high order byte, low order byte)
    address - the address to be set to the MAR
    isPartial - whether or not this is a full address or a high/low order byte; default false
    isHighOrder - whether or not this is a high or low order byte; default false
    */
    public setAddressByte(address : number, isPartial : boolean = false, isHighOrder : boolean = false) : void
    {
        if(isPartial)
        {
            var currMar : number = this._RAM.getMAR();

            if(isHighOrder)
            {
                address = address << 8; //left shift byte 8 bits to correctly represent the high order
                currMar = currMar & 0x00FF; //clear the high order byte of the current mar
            }
            else
            {
                currMar = currMar & 0xFF00; //clear the low order byte of the current mar
            }

            address = address | currMar; //add the shifted byte to half-cleared mar
        }

        //if there was no partial, then this just sets the mar to the full address
        this._RAM.setMAR(address);
    }

    /*
    Reads from memory with whatever address that was set with setAddressByte()
    returns the data from memory at that address
    */
    public read() : number
    {
        this._RAM.read()
        return this._RAM.getMDR();
    }

    /*
    Writes some data into the address that was set with setAddressByte()
    */
    public write(data : number) : void
    {
        this._RAM.setMDR(data);
        this._RAM.write();
    }

    /*
    Immediately writes some data into a given address
    */
    public writeImmediate(address : number, data : number)
    {
        this.setAddressByte(address);
        this.write(data);
    }

    /*
    Logs a section of memory between two addresses
    fromAddress - the first address to log
    toAddress - the last address to log
    */
    public memoryDump(fromAddress : number, toAddress : number)
    {
        this.log("Memory Dump: Debug");
        this.log("------------------------------------");

        for(var i : number = fromAddress;i <= toAddress;i++)
        {
            this.setAddressByte(i);
            this.log("Addr " + this.hexLog(i, ADD_SPACE_FMT_LEN) + "  |  " + this.hexLog(this.read(), WORD_FMT_LEN) + "");
        }

        this.log("------------------------------------");
        this.log("Memory Dump: Complete");
    }
}