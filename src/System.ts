// import statements for hardware
import { Clock } from "./hardware/Clock";
import { Cpu } from "./hardware/Cpu";
import { Hardware } from "./hardware/Hardware";
import { InterruptController } from "./hardware/InterruptController";
import { Keyboard } from "./hardware/Keyboard";
import { Memory } from "./hardware/Memory";
import { MMU } from "./hardware/MMU";


/*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL= 50;               // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
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
    private _IC : InterruptController = null;
    private _Keyboard : Keyboard = null;
    
    public running: boolean = false;

    constructor(debug : boolean) 
    {
        super(0, "System", debug);

        this._Memory = new Memory(false);
        this._MMU = new MMU(true, this._Memory);
        this._IC = new InterruptController(false);
        this._Keyboard = new Keyboard(false, this._IC);
        this._CPU = new Cpu(false, this, this._MMU, this._IC);
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
        this._IC.startListen();

        this.flashProgram();

        return true;
    }

    public stopSystem(): void 
    {
        this.log("Halting...");
        this._Clock.stopPulse();
        process.exit();
    }

    public flashProgram() : void
    {
        //this._MMU.powersProgram();
        //this._MMU.systemCallProgram();
        this._MMU.evenOdd();
    }
}

let system: System = new System(true);
