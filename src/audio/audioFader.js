
export class AudioFader {
    constructor(audio, { volume = 1 } = {}) {

        this.audio = audio;
        this.targetVolume = Math.min(Math.max(volume, 0), 1);
        this._fadeInterval = null;
    }


    fadeIn(duration = 1000) {
        return new Promise((resolve, reject) => {
            if (this._fadeInterval) {
                clearInterval(this._fadeInterval);
                this._fadeInterval = null;
            }

            this.audio.volume = 0;

            let playPromise;
            if (this.audio.paused) {
                this.audio.currentTime = 0;
                playPromise = this.audio.play();
            } else {
                playPromise = Promise.resolve();
            }

            playPromise
                .then(() => {
                    const steps = 20;
                    const stepTime = duration / steps;
                    const increment = this.targetVolume / steps;
                    let currentVol = 0;

                    this._fadeInterval = setInterval(() => {
                        currentVol += increment;
                        if (currentVol >= this.targetVolume) {
                            this.audio.volume = this.targetVolume;
                            clearInterval(this._fadeInterval);
                            this._fadeInterval = null;
                            resolve();
                        } else {
                            this.audio.volume = currentVol;
                        }
                    }, stepTime);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    fadeOut(duration = 1000) {
        if (this._fadeInterval) {
            clearInterval(this._fadeInterval);
            this._fadeInterval = null;
        }

        const steps = 20;
        const stepTime = duration / steps;
        const startVol = this.audio.volume;
        const decrement = startVol / steps;
        let currentVol = startVol;

        this._fadeInterval = setInterval(() => {
            currentVol -= decrement;
            if (currentVol <= 0) {
                this.audio.volume = 0;
                this.audio.pause();
                clearInterval(this._fadeInterval);
                this._fadeInterval = null;
            } else {
                this.audio.volume = currentVol;
            }
        }, stepTime);
    }


    stopInstant() {
        if (this._fadeInterval) {
            clearInterval(this._fadeInterval);
            this._fadeInterval = null;
        }
        this.audio.volume = 0;
        this.audio.pause();
    }

    pause() {
        if (this._fadeInterval) {
            clearInterval(this._fadeInterval);
            this._fadeInterval = null;
        }
        this.audio.pause();
    }

    stopAndReset() {
        this.stopInstant();
        this.audio.currentTime = 0;
    }
}
