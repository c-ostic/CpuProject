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
    private _IC : InterruptController = null;
    private _Keyboard : Keyboard = null;
    
    public running: boolean = false;

    constructor(debug : boolean) 
    {
        super(0, "System", debug);

        this._Memory = new Memory(false);
        this._MMU = new MMU(false, this._Memory);
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

        this.systemCallProgram();

        return true;
    }

    public stopSystem(): boolean 
    {
        this.log("Halting... Ctrl^C to exit");
        this._Clock.stopPulse();
        return false;
    }

    public flashProgram() : void
    {
        this._MMU.writeImmediate(0x0000, 0xA2);
        this._MMU.writeImmediate(0x0001, 0x1A);
        this._MMU.writeImmediate(0x0002, 0xEC);
        this._MMU.writeImmediate(0x0003, 0x0A);
        this._MMU.writeImmediate(0x0004, 0x00);
        this._MMU.writeImmediate(0x0005, 0xD0);
        this._MMU.writeImmediate(0x0006, 0x02);
        this._MMU.writeImmediate(0x0007, 0xA9);
        this._MMU.writeImmediate(0x0008, 0x0B);
        this._MMU.writeImmediate(0x0009, 0x00);
        this._MMU.writeImmediate(0x000A, 0x1A);
    }

    public systemCallProgram() : void
    {
        // load constant 
        this._MMU.writeImmediate(0x0000, 0xA9);
        this._MMU.writeImmediate(0x0001, 0xFF);
        // write acc to 0040
        this._MMU.writeImmediate(0x0002, 0x8D);
        this._MMU.writeImmediate(0x0003, 0x40);
        this._MMU.writeImmediate(0x0004, 0x00);
        // Load y from 0040
        this._MMU.writeImmediate(0x0005, 0xAC);
        this._MMU.writeImmediate(0x0006, 0x40);
        this._MMU.writeImmediate(0x0007, 0x00);
        // Load x with 2
        this._MMU.writeImmediate(0x0008, 0xA2);
        this._MMU.writeImmediate(0x0009, 0x02);
        // make the system call to print the string located at address in y register
        this._MMU.writeImmediate(0x000A, 0xFF);
        this._MMU.writeImmediate(0x000B, 0x00);

        //put the string 'Hello World!' into memory
        this._MMU.writeImmediate(0x00FF, 0x0A);
        this._MMU.writeImmediate(0x0100, 0x48);
        this._MMU.writeImmediate(0x0101, 0x65);
        this._MMU.writeImmediate(0x0102, 0x6C);
        this._MMU.writeImmediate(0x0103, 0x6C);
        this._MMU.writeImmediate(0x0104, 0x6F);
        this._MMU.writeImmediate(0x0105, 0x20);
        this._MMU.writeImmediate(0x0106, 0x57);
        this._MMU.writeImmediate(0x0107, 0x6F);
        this._MMU.writeImmediate(0x0108, 0x72);
        this._MMU.writeImmediate(0x0109, 0x6C);
        this._MMU.writeImmediate(0x010A, 0x64);
        this._MMU.writeImmediate(0x010B, 0x21);
        this._MMU.writeImmediate(0x010C, 0x0A);
        this._MMU.writeImmediate(0x010D, 0x00);
    }
}

let system: System = new System(true);
