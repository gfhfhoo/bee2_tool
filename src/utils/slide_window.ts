export class SlideWindow {
    private slides: number[];
    private ptr: number;
    private readonly max: number;

    constructor(init: number) {
        this.slides = Array(init).fill(new Date().getTime());
        this.ptr = 0;
        this.max = init;
    }

    add(ele: number) {
        this.slides[this.ptr] = ele;
        this.ptr = (this.ptr + 1) % this.max;
    }

    getAvg() {
        let diff = 0;
        for (let i = 1; i < this.slides.length; ++i) {
            diff += Math.abs(this.slides[i] - this.slides[i - 1])
        }
        return diff / this.max;
    }
}
