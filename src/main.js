import { Application } from '@splinetool/runtime';




const TerminalEmulator = {
  init(screen) {
    const inst = Object.create(this);
    inst.screen = screen;
    inst.createInput();
    return inst;
  },
  createInput() {
    const inputField = document.createElement('div');
    const inputWrap = document.createElement('div');
    inputField.className = 'terminal_emulator__field';
    inputField.innerHTML = '';
    inputWrap.appendChild(inputField);
    this.screen.appendChild(inputWrap);
    this.field = inputField;
    this.fieldwrap = inputWrap;
  },
  enterInput(input) {
    return new Promise(resolve => {
      const randomSpeed = (max, min) => Math.random() * (max - min) + min;
      let speed = randomSpeed(70, 90);
      let i = 0;
      let str = '';
      const type = () => {
        str += input[i];
        this.field.innerHTML = str.replace(/ /g, '&nbsp;');
        i++;
        setTimeout(() => {
          if (i < input.length) {
            if (i % 5 === 0) speed = randomSpeed(80, 120);
            type();
          } else {
            setTimeout(() => resolve(), 400);
          }
        }, speed);
      };
      type();
    });
  },
  enterCommand() {
    return new Promise(resolve => {
      const resp = document.createElement('div');
      resp.className = 'terminal_emulator__command';
      resp.innerHTML = this.field.innerHTML;
      this.screen.insertBefore(resp, this.fieldwrap);
      this.field.innerHTML = '';
      resolve();
    });
  },
  enterResponse(response) {
    return new Promise(resolve => {
      const resp = document.createElement('div');
      resp.className = 'terminal_emulator__response';
      resp.innerHTML = response;
      this.screen.insertBefore(resp, this.fieldwrap);
      resolve();
    });
  },
  wait(time, busy = true) {
    return new Promise(resolve => {
      if (busy) {
        this.field.classList.add('waiting');
      } else {
        this.field.classList.remove('waiting');
      }
      setTimeout(() => resolve(), time);
    });
  },
  reset() {
    return new Promise(resolve => {
      this.field.classList.remove('waiting');
      resolve();
    });
  }
};

const canvasWrapper = document.getElementById('canvas-wrapper');
const canvas = document.getElementById('canvas3d');
canvasWrapper.style.display = 'none'; // از اول مخفی

const app = new Application(canvas);
const TE = TerminalEmulator.init(document.getElementById('screen'));

async function runTerminalLoading(TE) {
  await TE.wait(1000, false);
  await TE.enterInput('Loading 3D scene...');
  await TE.enterCommand();
  await TE.enterResponse('Initializing...');
  await TE.wait(1500);
  await TE.enterResponse('Fetching resources...');
  await TE.wait(1800);
  await TE.enterResponse('Applying assets...');
  await TE.wait(1300);
  await TE.enterResponse('Almost done...');
  await TE.wait(1000);
  await TE.enterResponse('Done!');
  await TE.reset();
}

async function loadApp() {
  await runTerminalLoading(TE);

  const splinePath = `${import.meta.env.BASE_URL}scene.splinecode`;


  try {
    await app.load(splinePath);
  } catch(e) {
    console.error('Spline load error:', e);
  }

  const loader = document.getElementById('loader-container');
  const welcome = document.getElementById('welcome-screen');

  loader.classList.add('fade-out');
  welcome.classList.add('visible');

  setTimeout(() => {
    loader.style.display = 'none';

    setTimeout(() => {
      welcome.classList.remove('visible');
      welcome.classList.add('fade-out');

      setTimeout(() => {
        welcome.style.display = 'none';
        // حالا canvas رو نمایش بده
        canvasWrapper.style.display = 'block';
      }, 1000);

    }, 3000);

  }, 900);
}

loadApp();
