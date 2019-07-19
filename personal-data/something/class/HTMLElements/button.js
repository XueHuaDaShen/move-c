class MyButton extends HTMLElement {

	get open() {
		return this.hasAttribute("open");
	}

	set open(val) {
		if( val ){
			this.setAttribute("open", val);
		}else{
			this.removeAttribute("open");
		}
		this.toggleButton();
	}

	get disabled() {
		return this.hasAttribute("disabled");
	}

	set disabled(val) {
		if( val ){
			this.setAttribute("disabled", val);
		}else{
			this.removeAttribute("disabled");
		}
		this.toggleButton();
	}

	constructor() {
		super();
		this.addEventListener("click", e => {
			console.log(e)
			this.toggleButton();
		})
		this.innerHTML = "my first HTMLElement";
		this.style.padding = "2px 10px"
		this.style.border = "1px solid #ccc";
		this.style.borderRadius = '10px';
	}

	toggleButton(){
		console.log(this.disabled)
		console.log(this.open)
	}
}

window.customElements.define("my-button", MyButton)

class MyButtonEX extends MyButton{
	constructor() {
		super();
		// this.addEventListener("click", e => {
		// 	console.log(e)
		// 	this.toggleButton();
		// })
		// this.innerHTML = "my-button-ex"
	}

	toggleButton() {
		super.toggleButton();
	}
}
window.customElements.define("my-button-ex", MyButtonEX)

 
class FancyButton extends HTMLButtonElement{
  constructor() {
    super(); // always call super() first in the ctor.
    this.addEventListener('click', e => this.drawRipple(e.offsetX, e.offsetY));
  }

  // Material design ripple animation.
  drawRipple(x, y) {
    let div = document.createElement('div');
    div.classList.add('ripple');
    this.appendChild(div);
    div.style.top = `${y - div.clientHeight/2}px`;
    div.style.left = `${x - div.clientWidth/2}px`;
    div.style.backgroundColor = 'currentColor';
    div.classList.add('run');
    div.addEventListener('transitionend', e => div.remove());
  }
}

window.customElements.define('fancy-button', FancyButton, {extends: 'button'});