"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementEnhancement = void 0;
class ElementEnhancement {
    constructor(option) {
        this.option = option;
        this.el = null;
        this.selectors = {};
        if (option.selector) {
            this.el = document.querySelector(option.selector);
        }
        else {
            this.el = option.el;
        }
    }
    isAvailable() {
        return !!this.el;
    }
    define(option) {
        this.selectors[option.name] = option.selector;
        return this;
    }
    get(name) {
        return this.el.querySelector(this.selectors[name]);
    }
    gets(name) {
        return Array.from(this.el.querySelectorAll(this.selectors[name]));
    }
    static fromSelector(selector, Cons = ElementEnhancement) {
        return Array.from(document.querySelectorAll(selector)).map(el => new Cons({ el: el }));
    }
    static firstFromSelector(selector, Cons = ElementEnhancement) {
        return new Cons({ el: document.querySelector(selector) });
    }
}
exports.ElementEnhancement = ElementEnhancement;
