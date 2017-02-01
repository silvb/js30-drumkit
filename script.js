window.addEventListener('keydown', event => {
    play(event.keyCode);
});

const drums = document.querySelectorAll('.drum');

drums.forEach(drum => {
    drum.addEventListener('transitionend', removeTransition);
    drum.addEventListener('click', playOnClick);
});

const looper = {
    loop: [],
    isRecording: false,
    startTime: 0,
    endTime: 0,
    toggle() {
        this.isRecording = !this.isRecording;

        if (this.isRecording) {
            this.start();
        } else {
            this.stop();
        }
    },
    start() {
        this.startTime = Date.now();
        document.querySelector('.status-light').classList.add('on');

        if (this.loop.length > 0) {
            this.play();
        }
    },
    stop() {
        this.endTime = Date.now() - this.startTime;
        document.querySelector('.status-light').classList.remove('on');
    },
    addNote(keyCode) {
        const time = Date.now() - this.startTime;
        if (this.loop.find(note => {
            const hasKey = note.keyCode === keyCode;
            const min = note.time - 20;
            const max = note.time + 20;
            const isInInterval = time > min && time < max;
            return hasKey && isInInterval;
        })) {
            return;
        }

        this.loop.push({ keyCode, time });
    },
    play() {
        this.loop.forEach(note => {
            setTimeout(() => {
                play(note.keyCode);
            }, note.time);
        });
    }
};

// FUNCTIONS
function removeTransition(event) {
    if (event.propertyName !== 'transform') {
        return;
    }

    this.classList.remove('playing');
}

function playOnClick() {
    play(this.getAttribute('data-key'));
}

function play(keyCode) {
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    const drum = document.querySelector(`.drum[data-key="${keyCode}"]`);

    if (audio) {
        audio.currentTime = 0;
        audio.play();
        if (looper.isRecording) {
            looper.addNote(keyCode);
        }
    }

    if (drum) {
        if (drum.classList.contains('looper')) {
            looper.toggle();
        }

        if (drum.classList.contains('play-loop')) {
            if (looper.isRecording) {
                return;
            }
            looper.play();
        }

        drum.classList.add('playing');
    }
}
