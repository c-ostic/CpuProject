//super class for all hardware classes
export class Hardware
{
    private id : number;
    private name : string;
    private debug : boolean;

    constructor(id : number, name : string, debug : boolean = true)
    {
        this.id = id;
        this.name = name;
        this.debug = debug; //set to true if not specified in constructor
    }

    public setID(newID : number) : void
    {
        this.id = newID;
    }

    public getID() : number
    {
        return this.id;
    }

    public setName(newName : string) : void
    {
        this.name = newName;
    }

    public getName() : string
    {
        return this.name;
    }

    public setDebug(newDebugStatus : boolean) : void
    {
        this.debug = newDebugStatus;
    }

    public getDebug() : boolean
    {
        return this.debug;
    }

    public log(message : string) : void
    {
        //only log messages if debug is true
        if(this.debug)
        {
            console.log("[HW - " + this.name + " id: " + this.id + " - " + Date.now() + "]: " + message);
        }
    }

    //return the hex string representation of num
    public hexLog(num : number, length : number) : string
    {
        var stringNum : string = num.toString(16);

        stringNum = stringNum.padStart(length, "0").toUpperCase();

        return stringNum;
    }
}