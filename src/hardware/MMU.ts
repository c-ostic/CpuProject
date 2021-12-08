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

    //***********************************************************************************************//
    //----------------------------Flashable programs beyond this point-------------------------------//
    //***********************************************************************************************//

    //Prints out powers of two
    //Stops at 40 due to overflow
    public powersProgram() : void
    {
        // load constant 0
        this.writeImmediate(0x0000, 0xA9);
        this.writeImmediate(0x0001, 0x00);
        // write acc (0) to 0040
        this.writeImmediate(0x0002, 0x8D);
        this.writeImmediate(0x0003, 0x40);
        this.writeImmediate(0x0004, 0x00);
        // load constant 1
        this.writeImmediate(0x0005, 0xA9);
        this.writeImmediate(0x0006, 0x01);
        // add acc (?) to mem 0040 (?)
        this.writeImmediate(0x0007, 0x6D);
        this.writeImmediate(0x0008, 0x40);
        this.writeImmediate(0x0009, 0x00);
        // write acc ? to 0040
        this.writeImmediate(0x000A, 0x8D);
        this.writeImmediate(0x000B, 0x40);
        this.writeImmediate(0x000C, 0x00);
        // Load y from memory 0040
        this.writeImmediate(0x000D, 0xAC);
        this.writeImmediate(0x000E, 0x40);
        this.writeImmediate(0x000F, 0x00);
        // Load x with constant (1) (to make the first system call)
        this.writeImmediate(0x0010, 0xA2);
        this.writeImmediate(0x0011, 0x01);
        // make the system call to print the value in the y register (3)
        this.writeImmediate(0x0012, 0xFF);
        // Load x with constant (2) (to make the second system call for the string)
        this.writeImmediate(0x0013, 0xA2);
        this.writeImmediate(0x0014, 0x03);
        // make the system call to print the value in the y register (3)
        this.writeImmediate(0x0015, 0xFF);
        this.writeImmediate(0x0016, 0x50);
        this.writeImmediate(0x0017, 0x00);
        // test DO (Branch Not Equal) will be NE and branch (0x0021 contains 0x20 and xReg contains B2)
        this.writeImmediate(0x0018, 0xD0);
        this.writeImmediate(0x0019, 0xED);
        // globals
        this.writeImmediate(0x0050, 0x2C);
        this.writeImmediate(0x0052, 0x00);
    }

    //Tests the system calls
    public systemCallProgram() : void
    {
        // load constant 3
        this.writeImmediate(0x0000, 0xA9);
        this.writeImmediate(0x0001, 0x0A);
        // write acc (3) to 0040
        this.writeImmediate(0x0002, 0x8D);
        this.writeImmediate(0x0003, 0x40);
        this.writeImmediate(0x0004, 0x00);
        // :loop
        // Load y from memory (3)
        this.writeImmediate(0x0005, 0xAC);
        this.writeImmediate(0x0006, 0x40);
        this.writeImmediate(0x0007, 0x00);
        // Load x with constant (1) (to make the first system call)
        this.writeImmediate(0x0008, 0xA2);
        this.writeImmediate(0x0009, 0x01);
        // make the system call to print the value in the y register (3)
        this.writeImmediate(0x000A, 0xFF);
        // Load x with constant (2) (to make the second system call for the string)
        this.writeImmediate(0x000B, 0xA2);
        this.writeImmediate(0x000C, 0x02);
        // Load y with constant (50) for the string
        this.writeImmediate(0x000D, 0xA0);
        this.writeImmediate(0x000E, 0x50);
        // make the system call to print the value in the y register (3)
        this.writeImmediate(0x000F, 0xFF);
        this.writeImmediate(0x0010, 0x00);
        // load the string
        // 0A 48 65 6c 6c 6f 20 57 6f 72 6c 64 21
        this.writeImmediate(0x0050, 0x0A);
        this.writeImmediate(0x0051, 0x48);
        this.writeImmediate(0x0052, 0x65);
        this.writeImmediate(0x0053, 0x6C);
        this.writeImmediate(0x0054, 0x6C);
        this.writeImmediate(0x0055, 0x6F);
        this.writeImmediate(0x0056, 0x20);
        this.writeImmediate(0x0057, 0x57);
        this.writeImmediate(0x0058, 0x6F);
        this.writeImmediate(0x0059, 0x72);
        this.writeImmediate(0x005A, 0x6C);
        this.writeImmediate(0x005B, 0x64);
        this.writeImmediate(0x005C, 0x21);
        this.writeImmediate(0x005D, 0x0A);
        this.writeImmediate(0x005E, 0x00);
    }

    //Tests whether a number is even or odd
    //change the number in 0x1 to test the parity of different numbers
    public evenOdd() : void
    {
        this.writeImmediate(0x0, 0xA9);
        this.writeImmediate(0x1, 0x05);
        this.writeImmediate(0x2, 0x8D);
        this.writeImmediate(0x3, 0x31);
        this.writeImmediate(0x4, 0x00);
        this.writeImmediate(0x5, 0x8D);
        this.writeImmediate(0x6, 0x31);
        this.writeImmediate(0x7, 0x00);
        this.writeImmediate(0x8, 0xA2);
        this.writeImmediate(0x9, 0x01);
        this.writeImmediate(0xa, 0xEC);
        this.writeImmediate(0xb, 0x31);
        this.writeImmediate(0xc, 0x00);
        this.writeImmediate(0xd, 0xD0);
        this.writeImmediate(0xe, 0x06);
        this.writeImmediate(0xf, 0xA2);
        this.writeImmediate(0x10, 0x03);
        this.writeImmediate(0x11, 0xFF);
        this.writeImmediate(0x12, 0x32);
        this.writeImmediate(0x13, 0x00);
        this.writeImmediate(0x14, 0x00);
        this.writeImmediate(0x15, 0xA2);
        this.writeImmediate(0x16, 0x00);
        this.writeImmediate(0x17, 0xEC);
        this.writeImmediate(0x18, 0x31);
        this.writeImmediate(0x19, 0x00);
        this.writeImmediate(0x1a, 0xD0);
        this.writeImmediate(0x1b, 0x06);
        this.writeImmediate(0x1c, 0xA2);
        this.writeImmediate(0x1d, 0x03);
        this.writeImmediate(0x1e, 0xFF);
        this.writeImmediate(0x1f, 0x37);
        this.writeImmediate(0x20, 0x00);
        this.writeImmediate(0x21, 0x00);
        this.writeImmediate(0x22, 0xAD);
        this.writeImmediate(0x23, 0x31);
        this.writeImmediate(0x24, 0x00);
        this.writeImmediate(0x25, 0x6D);
        this.writeImmediate(0x26, 0x30);
        this.writeImmediate(0x27, 0x00);
        this.writeImmediate(0x28, 0xA2);
        this.writeImmediate(0x29, 0xFF);
        this.writeImmediate(0x2a, 0xEC);
        this.writeImmediate(0x2b, 0x31);
        this.writeImmediate(0x2c, 0x00);
        this.writeImmediate(0x2d, 0xD0);
        this.writeImmediate(0x2e, 0xD6);
        this.writeImmediate(0x2f, 0x00);
        this.writeImmediate(0x30, 0xFE);
        this.writeImmediate(0x31, 0x00);
        this.writeImmediate(0x32, 0x4F);
        this.writeImmediate(0x33, 0x44);
        this.writeImmediate(0x34, 0x44);
        this.writeImmediate(0x35, 0x0A);
        this.writeImmediate(0x36, 0x00);
        this.writeImmediate(0x37, 0x45);
        this.writeImmediate(0x38, 0x56);
        this.writeImmediate(0x39, 0x45);
        this.writeImmediate(0x3A, 0x4E);
        this.writeImmediate(0x3B, 0x0A);
        this.writeImmediate(0x3C, 0x00);
    }
}