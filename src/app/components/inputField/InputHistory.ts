export class InputHistory {
    inputArray: string[] = [];
    position: number = 0;
    unsavedInput: string = "";

    public saveChanges: React.Dispatch<React.SetStateAction<InputHistory>>;
    
    public addEntry(text: string): void {
        if (text !== this.inputArray[this.inputArray.length - 1]) {
            this.inputArray.push(text);
        }
        this.position = 0;
        if (this.inputArray.length > 10) {
            this.inputArray.shift();
        }
        this.saveChanges(this);
    }

    public getNextEntry(curText: string, dir: number): string {
        if (this.inputArray.length === 0) {
            return curText;
        }

        if (this.position === 0) //0 means on a new unsubmitted input, not in the array.
        {
            this.unsavedInput = curText;

        }
        const totalInputs = this.inputArray.length + 1;
        this.position = (this.position + dir + totalInputs) % totalInputs;
        let ret="";
        if (this.position === 0) {
            ret= this.unsavedInput;
        }

        else {
            ret= this.inputArray[this.inputArray.length - this.position];
        }
        this.saveChanges(this);
        return ret;
    }
}
