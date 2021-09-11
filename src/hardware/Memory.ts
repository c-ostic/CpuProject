import { Hardware } from "./Hardware";

export class Memory extends Hardware
{
    private memory : number[];

    constructor()
    {
        super(0, "RAM");

        //total memory of 65536
        this.memory = new Array(0x10000);

        for (var i = 0x00; i < this.memory.length; i++)
        {
            this.memory[i] = 0x00;
        }
    }

    /*
    Save data in a specific location in memory
    data - the data to be saved
    location - the location the data should be saved to
    */
    public setMemoryAtLocation(data : number, location : number) : void 
    {

    }

    /*
    Retrieve data from a specific location in memory
    location - the location to be retrieved
    return - the data at location, or null if location is out of range
    */
    public readMemory(location : number) : number
    {
        return null;
    }

    /*
    Log data from a specific location in memory
    location - the location to be retrieved
    */
    public displayMemory(location : number) : void
    {
        
    }

    /*
    Log data from a specific location range in memory, inclusive
    lowerBound, upperBound - the bounds of the range; both are included
    */
    public displayMemoryRange(lowerBound : number, upperBound : number) : void
    {
        
    }
}