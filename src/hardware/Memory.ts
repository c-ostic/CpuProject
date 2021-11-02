import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";

const ADDRESS_SPACE : number = 0x10000; //# of address spaces in memory
const ADD_SPACE_FMT_LEN : number = 4;
const MAX_WORD_SIZE : number = 0xFF;
const WORD_FMT_LEN : number = 2;

export class Memory extends Hardware implements ClockListener
{
    private memory : number[];
    private mar : number;
    private mdr : number;

    constructor()
    {
        super(0, "RAM");

        //total memory of 65536
        this.memory = new Array(ADDRESS_SPACE);

        this.reset();
    }

    public getMAR() : number
    {
        return this.mar;
    }

    public setMAR(address : number) : void
    {
        this.mar = address;
    }

    public getMDR() : number
    {
        return this.mdr;
    }

    public setMDR(data : number) : void
    {
        this.mdr = data;
    }

    public pulse() : void
    {
        this.log("recieved clock pulse");
    }

    public reset() : void
    {
        for (var i = 0x00; i < this.memory.length; i++)
        {
            this.memory[i] = 0x00;
        }
    }


    /*
    Save data in a specific location in memory
    data - the data to be saved
    location - the location the data should be saved to
    return - true if save was successful, false otherwise
    */
    public setMemoryAtLocation(data : number, location : number) : boolean 
    {
        var flag : boolean;

        //first check if location is valid
        if (location < 0x00 || location >= ADDRESS_SPACE)
        {
            flag = false;
            this.log("[ERROR] Address " + this.hexLog(location, ADD_SPACE_FMT_LEN) + " undefined");
        }
        else
        {
            //then check if data is valid
            if(data > MAX_WORD_SIZE)
            {
                flag = false;
                this.log("[ERROR] Value " + this.hexLog(data, WORD_FMT_LEN) + " too large to store");
            }
            else
            {
                flag = true;
                this.memory[location] = data;
            }
        }

        return flag;
    }


    /*
    Retrieve data from a specific location in memory
    location - the location to be retrieved
    return - the data at location, or null if location is out of range
    */
    public readMemory(location : number) : number
    {
        var data : number;

        //if location is invalid, set data to null and log an error
        if (location < 0x00 || location >= ADDRESS_SPACE)
        {
            data = null;
            this.log("[ERROR] Address " + this.hexLog(location, ADD_SPACE_FMT_LEN) + " undefined");
        }
        else
        {
            data = this.memory[location];
        }

        return data;
    }


    /*
    Log data from a specific location in memory
    location - the location to be retrieved
    */
    public displayMemory(location : number) : void
    {
        //if location is invalid, set data to null and log an error
        if (location < 0x00 || location >= ADDRESS_SPACE)
            this.log("[ERROR] Address " + this.hexLog(location, ADD_SPACE_FMT_LEN) + " undefined");
        else
            this.log("Address: " + this.hexLog(location, ADD_SPACE_FMT_LEN) + "\tValue: " + 
                this.hexLog(this.memory[location], WORD_FMT_LEN));
    }


    /*
    Log data from a specific location range in memory
    location - the starting location of the range
    length - the amount of memory locations to log
    */
    public displayMemoryRange(location : number, length : number) : void
    {
        var hasError : boolean = false;

        //if either bound is invalid, set data to null and log an error
        if (location < 0x00 || location >= ADDRESS_SPACE)
        {
            hasError = true;
            this.log("[ERROR] Address " + this.hexLog(location, ADD_SPACE_FMT_LEN) + " undefined");
        }

        if (location + length >= ADDRESS_SPACE)
        {
            hasError = true;
            this.log("[ERROR] Specified length (" + this.hexLog(length, ADD_SPACE_FMT_LEN) + ") exceeds address space");
        }

        //if there's no error, display the range
        if(!hasError)
            for (var i = 0; i < length; i++)
                this.displayMemory(location + i);
    }
}