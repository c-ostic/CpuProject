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
        this._MMU = new MMU(true, this._Memory);
        this._CPU = new Cpu(true, this, this._MMU);
        this._Clock = new Clock(false, CLOCK_INTERVAL);

        this.log("created");
        
        /*
        Start the system (Analogous to pressing the power button and having voltages flow through the components)
        When power is applied to the system clock, it begins sending pulses to all clock observing hardware
        components so they can act on each clock cycle.
         */

        this.startSystem();
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
        this._MMU.memoryDump(0x0014, 0x0016);
        return false;
    }

    public flashProgram() : void
    {
        this._MMU.writeImmediate(0x0000, 0xA9);
        this._MMU.writeImmediate(0x0001, 0xFF);
        this._MMU.writeImmediate(0x0002, 0x8D);
        this._MMU.writeImmediate(0x0003, 0x14);
        this._MMU.writeImmediate(0x0004, 0x00);
        this._MMU.writeImmediate(0x0005, 0xA9);
        this._MMU.writeImmediate(0x0006, 0x7F);
        this._MMU.writeImmediate(0x0007, 0x8D);
        this._MMU.writeImmediate(0x0008, 0x15);
        this._MMU.writeImmediate(0x0009, 0x00);
        this._MMU.writeImmediate(0x000A, 0xEE);
        this._MMU.writeImmediate(0x000B, 0x14);
        this._MMU.writeImmediate(0x000C, 0x00);
        this._MMU.writeImmediate(0x000D, 0xEE);
        this._MMU.writeImmediate(0x000E, 0x15);
        this._MMU.writeImmediate(0x000F, 0x00);
        this._MMU.writeImmediate(0x0010, 0xEE);
        this._MMU.writeImmediate(0x0011, 0x16);
        this._MMU.writeImmediate(0x0012, 0x00);
        this._MMU.writeImmediate(0x0013, 0x00);
    }
}

let system: System = new System(true);
