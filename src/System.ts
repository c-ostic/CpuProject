// import statements for hardware
import { Clock } from "./hardware/Clock";
import { Cpu } from "./hardware/Cpu";
import { Hardware } from "./hardware/Hardware";
import { Memory } from "./hardware/Memory";


/*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL= 500;               // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
                                        // A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
                                        // .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
                                        // small, I recommend a setting of 100, if you want to slow things down
                                        // make it larger.


export class System extends Hardware
{
    private _CPU : Cpu = null;
    private _Memory : Memory = null;
    private _Clock : Clock = null;
    
    public running: boolean = false;

    constructor() 
    {
        super(0, "System");

        this._CPU = new Cpu();
        this._Memory = new Memory();
        this._Clock = new Clock(CLOCK_INTERVAL);
        
        /*
        Start the system (Analogous to pressing the power button and having voltages flow through the components)
        When power is applied to the system clock, it begins sending pulses to all clock observing hardware
        components so they can act on each clock cycle.
         */

        this.startSystem();

    }

    public startSystem(): boolean 
    {
        //this._CPU.setDebug(false);

        this.log("created");
        this._CPU.log("created");
        this._Memory.log("created");
        this._Clock.log("created");

        this._Clock.register(this._CPU);
        this._Clock.register(this._Memory);

        this._Memory.displayMemory(0x10000);
        this._Memory.displayMemoryRange(0x00, 0x14);

        return true;
    }

    public stopSystem(): boolean 
    {
        return false;
    }
}

let system: System = new System();
