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

    constructor(debug : boolean)
    {
        super(0, "RAM", debug);

        //total memory of 65536
        this.memory = new Array(ADDRESS_SPACE);
        this.log("Created - Addressable space : 65536")

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
    Save data in a specific location in memory using MAR and MDR
    return - true if save was successful, false otherwise
    */
    public write() : boolean 
    {
        var flag : boolean;

        //first check if location is valid
        if (this.mar < 0x00 || this.mar >= ADDRESS_SPACE)
        {
            flag = false;
            this.log("[ERROR] Address " + this.hexLog(this.mar, ADD_SPACE_FMT_LEN) + " undefined");
        }
        else
        {
            //then check if data is valid
            if(this.mdr > MAX_WORD_SIZE)
            {
                flag = false;
                this.log("[ERROR] Value " + this.hexLog(this.mdr, WORD_FMT_LEN) + " too large to store");
            }
            else
            {
                flag = true;
                this.memory[this.mar] = this.mdr;
            }
        }

        return flag;
    }


    /*
    Retrieve data from a specific location in memory using MAR and MDR
    */
    public read() : void
    {
        //if location is invalid, set data to null and log an error
        if (this.mar < 0x00 || this.mar >= ADDRESS_SPACE)
        {
            this.mdr = null;
            this.log("[ERROR] Address " + this.hexLog(this.mar, ADD_SPACE_FMT_LEN) + " undefined");
        }
        else
        {
            this.mdr = this.memory[this.mar];
        }
    }
}