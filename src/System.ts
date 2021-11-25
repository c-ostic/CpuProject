// import statements for hardware
import { Clock } from "./hardware/Clock";
import { Cpu } from "./hardware/Cpu";
import { Hardware } from "./hardware/Hardware";
import { Memory } from "./hardware/Memory";
import { MMU } from "./hardware/MMU";


/*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL= 200;               // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
                                        // A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
                                        // .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
                                        // small, I recommend a setting of 100, if you want to slow things down
                                        // make it larger.


export class System extends Hardware
{
    private _CPU : Cpu = null;
    private _Memory : Memory = null;
    private _MMU : MMU = null;
    private _Clock : Clock = null;
    
    public running: boolean = false;

    constructor(debug : boolean) 
    {
        super(0, "System", debug);

        this._Memory = new Memory(false);
        this._MMU = new MMU(false, this._Memory);
        this._CPU = new Cpu(true, this, this._MMU);
        this._Clock = new Clock(false, CLOCK_INTERVAL);

        this.log("created");
        
        /*
        Start the system (Analogous to pressing the power button and having voltages flow through the components)
        When power is applied to the system clock, it begins sending pulses to all clock observing hardware
        components so they can act on each clock cycle.
         */

        this.startSystem();

        this._MMU.memoryDump(0x0000, 0x000F);
    }

    public startSystem(): boolean 
    {
        this._Clock.register(this._CPU);
        this._Clock.register(this._Memory);

        this.flashProgram();

        return true;
    }

    public stopSystem(): boolean 
    {
        this._Clock.stopPulse();
        this.log("Halting...");
        return false;
    }

    public flashProgram() : void
    {
        this._MMU.writeImmediate(0x0000, 0xA9);
        this._MMU.writeImmediate(0x0001, 0x01);
        this._MMU.writeImmediate(0x0002, 0xAA);
        this._MMU.writeImmediate(0x0003, 0xA8);
        this._MMU.writeImmediate(0x0004, 0xA2);
        this._MMU.writeImmediate(0x0005, 0x02);
        this._MMU.writeImmediate(0x0006, 0x8A);
        this._MMU.writeImmediate(0x0007, 0xA0);
        this._MMU.writeImmediate(0x0008, 0x03);
        this._MMU.writeImmediate(0x0009, 0x98);
        this._MMU.writeImmediate(0x000A, 0xEA);
        this._MMU.writeImmediate(0x000B, 0x00);
    }
}

let system: System = new System(true);
