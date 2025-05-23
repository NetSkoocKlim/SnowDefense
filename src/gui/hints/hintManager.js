import {Game} from "../../game.js";

export class HintManager {

    eventEl;
    eventHandler;

    constructor() {
        this.hints = [];          // сюда загрузим нашу цепочку
        this.current = null;      // текущая подсказка
        this.overlay = this._createOverlay();
        this.overlay.style.display = 'none';
        this.finalHintByGroup = {
            intro: 'intro_15'
        }

        this.registerHints([
            {
                id: 'intro_1',
                group: 'intro',
                text: `Здравствуй, бесстрашный защитник Зимнего Полюса!<br>
Перед тобой расстилаются бескрайние льдины, пронизывающий мороз и… наша крошечная, но очень важная база производства мороженого. Здесь, в самом центре этой ледяной пустоши, ты будешь стоять на страже сладости, которую так жаждут голодные песцы.`,
                target: {type: 'auto'},
                trigger: {type: 'auto'},
                nextId: 'intro_2',
                modal: true,
                shown: false,
                start: true
            },
            {
                id: 'intro_2',
                group: 'intro',
                text: `Всё начинается прямо сейчас: ты берёшь на себя роль коменданта базы и единственного стрелка из пушки, заряженной порцией освежающего мороженого. Цель проста — отбить все волны пушистых вечно голодных хищников и не дать им разрушить стены твоего убежища.`,
                target: {type: 'auto'},
                trigger: {type: 'next'},
                nextId: 'intro_3',
                modal: true,
                shown: false
            },
            {
                id: 'intro_3',
                group: 'intro',
                text: `Прошу обратить внимание, что у вашей базы есть некоторые характеристики.`,
                target: {type: 'auto'},
                trigger: {type: 'next'},
                nextId: 'intro_4',
                modal: true,
                shown: false
            },
            {
                id: 'intro_4',
                group: 'intro',
                text: `Здесь ты можешь следить за её прочностью. Каждый раз когда песцы прорываются слишком близко и атакуют базу, ты теряешь часть прочности. Если полоса обнулится — стены разрушатся, песцы заберут всё имеющееся мороженное и игра закончится.`,
                target: {type: 'dom', selector: '.hp-bar-container'},
                trigger: {type: 'next'},
                nextId: 'intro_5',
                modal: true,
                shown: false
            },
            {
                id: 'intro_5',
                group: 'intro',
                text: `Это время перезарядки, в течение которого ты не сможешь стрелять. После каждого выстрела пушка немного «остывает». Позже, ты сможешь уменьшить это время`,
                target: {type: 'dom', selector: '.reload-bar-container'},
                trigger: {type: 'next'},
                nextId: 'intro_6',
                modal: true,
                shown: false
            },
            {
                id: 'intro_6',
                group: 'intro',
                text: `На этом описание характеристик базы завершено. <br>Давай теперь заглянем в системный раздел — «Статистика».`,
                target: {type: 'auto'},
                trigger: {type: 'next'},
                nextId: 'intro_7',
                modal: true,
                shown: false
            },
            {
                id: 'intro_7',
                group: 'intro',
                text: `Кликните, чтобы увидеть основную информацию об игре.`,
                target: {type: 'dom', selector: '.panel-header'},
                trigger: {type: 'click', selector: '.panel-header'},
                nextId: 'intro_8',
                modal: true,
                shown: false
            },
            {
                id: 'intro_8',
                group: 'intro',
                text: `Время — это таймер, показывающий, сколько секунд прошло с начала уровня.`,
                target: {type: 'dom', selector: '.time-row'},
                trigger: {type: 'next'},
                nextId: 'intro_9',
                modal: true,
                shown: false
            },
            {
                id: 'intro_9',
                group: 'intro',
                text: `Ледышки — твоя основная валюта, с их помощью ты сможешь покупать новые предметы, строить защитные башни и улучшать базу.`,
                target: {type: 'dom', selector: '.gold-row'},
                trigger: {type: 'next'},
                nextId: 'intro_10',
                modal: true,
                shown: false
            },
            {
                id: 'intro_10',
                group: 'intro',
                text: `Уровень — номер текущего этапа`,
                target: {type: 'dom', selector: '.level-row'},
                trigger: {type: 'next'},
                nextId: 'intro_11',
                modal: true,
                shown: false
            },
            {
                id: 'intro_11',
                group: 'intro',
                text: `Волна — счётчик текущей волны и общее число волн на данном уровне.`,
                target: {type: 'dom', selector: '.wave-row'},
                trigger: {type: 'next'},
                nextId: 'intro_12',
                modal: true,
                shown: false
            },
            {
                id: 'intro_12',
                group: 'intro',
                text: `Здесь ты можешь следить за числом зверьков, которые ещё должны быть накормлены.`,
                target: {type: 'dom', selector: '.enemies-row'},
                trigger: {type: 'next'},
                nextId: 'intro_13',
                modal: true,
                shown: false
            },
            {
                id: 'intro_13',
                group: 'intro',
                text: `Чтобы скрыть раздел статистики, необходимо ещё раз килкнуть по мигающей области"`,
                target: {type: 'dom', selector: '.panel-header'},
                trigger: {type: 'click', selector: '.panel-header'},
                nextId: 'intro_14',
                modal: true,
                shown: false
            },
            {
                id: 'intro_14',
                group: 'intro',
                text: `И напоследок, необходимо рассказать о том, как вы будете взаимодействовать с пушкой базы. 
                Для того, чтобы стрелять необходимо навестить курсором мыши на место, куда необходимо будет произвести выстрел. Однако обрати внимание, что пушка не может моментально развернуться, так что придётся немного подождать!`,
                target: {type: 'auto'},
                trigger: {type: 'next'},
                nextId: 'intro_15',
                modal: true,
                shown: false
            },
            {
                id: "intro_15",
                group: 'intro',
                text: `На этом вступительная часть окончена, нажми далее, когда будешь готов приступать к игре!`,
                target: {type: 'auto'},
                trigger: {type: 'next'},
                nextId: null,
                modal: true,
                shown: false
            }
        ]);
    }

    reset() {
        this.current = null;
        if (this.eventEl !== null && this.eventEl !== undefined) {
            this.eventEl.removeEventListener('click', this.eventHandler);
            this.eventEl = null;
            this.eventHandler = null;
        }

    }

    resetGroup(groupId) {
        Object.values(this.hints).forEach(hint => {
            if (hint.group === groupId) {
                hint.shown = false;
            }
        });
    }

    skipGroup(groupId) {
        Object.values(this.hints).forEach(hint => {
            if (hint.group === groupId) {
                hint.shown = true;
            }
        })
        this._endTutorial();
    }

    isCompleteGroup(groupId) {
        const finalId = this.finalHintByGroup[groupId];
        return finalId && this.hints[finalId]?.shown;
    }

    registerHints(hintsArray) {
        this.hints = hintsArray.reduce((map, h) => {
            map[h.id] = h;
            return map;
        }, {});
    }

    start(id) {
        this._pauseGame();
        this._showHint(id);
    }

    _showHint(id) {
        console.log(this.hints);
        const hint = this.hints[id];
        if (!hint) {
            return;
        }

        if (hint.shown) {
            return;
        }

        hint.shown = true;
        this.current = hint;

        this._highlightTarget(hint.target);

        const isFinal = hint.group
            && this.finalHintByGroup[hint.group] === hint.id;
        const showNextBtn = (hint.trigger.type !== 'click' && Boolean(hint.nextId)) || isFinal;

        this._renderTooltip(hint.text, showNextBtn);
        this._attachTrigger(hint);
    }

    _attachTrigger(hint) {
        if (hint.trigger.type === 'click') {
            const el = document.querySelector(hint.trigger.selector);
            this.eventEl = el;

            const handler = () => {
                this.overlay.style.display = 'none';
                setTimeout(() => {
                    this.eventEl = null;
                    this.eventHandler = null;
                    this.overlay.style.display = 'block';
                    this._onTrigger();
                }, 50);
            }

            this.eventHandler = handler;

            el.addEventListener('click', handler, { once: true });
        }

        const nextBtn = this.tooltip.querySelector('.btn-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this._onTrigger(), { once: true });
        }
        const skipBtn = this.tooltip.querySelector('.btn-skip');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipGroup(this.current.group), { once: true });
        }
    }

    _onTrigger() {
        this._cleanupCurrent();

        if (this.current?.nextId) {
            this._showHint(this.current.nextId);
        } else {
            this._endTutorial();
        }
    }

    _pauseGame() {
        Game.pauseGame();
    }

    _resumeGame() {
        Game.resumeGame();
    }

    _renderTooltip(htmlText, hasNext) {
        if (this.tooltip) this.tooltip.remove();
        const tip = document.createElement('div');
        tip.classList.add('tooltip');
        tip.innerHTML = `
        <div class="tooltip-text">${htmlText}</div>
        ${hasNext ? '<button class="btn-next">Далее</button>' : ''}
        ${this.current.start !== undefined ? '<button style="z-index: 250" class="btn-skip">Пропустить</button>': ''}`;

        document.querySelector("#game").appendChild(tip);
        this.tooltip = tip;
    }


    _highlightTarget(target) {
        this.overlay.style.display = 'block';

        if (target.type === 'dom') {
            const el = document.querySelector(target.selector);

            const rect = el.getBoundingClientRect();
            const gameRect = document.querySelector("#game").getBoundingClientRect();
            const box = document.createElement('div');
            Object.assign(box.style, {
                position: 'fixed',
                top:    `${rect.top - gameRect.top}px`,
                left:   `${rect.left - gameRect.left}px`,
                width:  `${rect.width}px`,
                height: `${rect.height}px`,
                boxSizing:    'border-box',
                border:       '4px solid #FFD700',
                borderRadius: '4px',
                pointerEvents:'none',
                zIndex:       75
            });
            box.classList.add('hint-blink');
            document.querySelector("#game").appendChild(box);
            this.highlightBox = box;
        }

    }

    _cleanupCurrent() {
        if (this.tooltip) this.tooltip.remove();
        if (this.highlightBox) this.highlightBox.remove();
    }

    hideTutorial() {
        this._cleanupCurrent();
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }

    _endTutorial() {
        this.hideTutorial();
        this.current = null;
        this._resumeGame();
    }


    _createOverlay() {
        const ov = document.createElement('div');
        ov.classList.add('hint-overlay');
        document.querySelector("#game").appendChild(ov);
        return ov;
    }
}