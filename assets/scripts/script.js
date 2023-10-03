// utils
const radians = (deg) => deg * (Math.PI / 180);
const sin = (deg) => Math.sin(radians(deg));
const cos = (deg) => Math.cos(radians(deg));
const random = (low, high) => Math.random() * (high - low + 1) + low;
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

function createRing(ringSize) {
	// ring container
	const ringContainer = document.createElement("div");
	ringContainer.style.animation = `spin ${random(25, 40)}s ease`;
	ringContainer.style.animationDirection =
		Math.random() < 0.5 ? "normal" : "reverse";

	// dot
	const dots = ringSize / 6;
	const inc = 360 / dots;
	const baseHue = Math.floor(random(170, 360 + 50)); // because I don't like green - ok 
	const expandDuration = random(1000, 1500);

	function animateDot(dot, transform) {
		const blastAnimation = dot.animate(
			[
				{
					transform: transform,
					opacity: 1
				}
			],
			{
				duration: expandDuration,
				easing: "ease",
				fill: "forwards"
			}
		);

		blastAnimation.onfinish = async () => {
			await wait(random(700, 1700));
			const flickerAnimation = dot.animate([{ opacity: 1 }, { opacity: 0 }], {
				easily: "ease",
				duration: random(200, 600),
				iterations: random(2, 8)
			});

			flickerAnimation.onfinish = () => {
				dot.remove();
			};
		};
	}

	const hueDiffusion = random(10, 60);
	const baseVariant = Math.floor(random(0, 2));

	function createDot(i) {
		const dot = document.createElement("div");
		ringContainer.append(dot);
		dot.className = "dot";

		// in 20% rings - set the same variant
		if (Math.random() < 0.1) {
			dot.dataset.variant = baseVariant;
		} else {
			dot.dataset.variant = Math.floor(random(0, 5));
		}

		const dotSize = ringSize / random(8, 10);
		dot.style.width = dotSize + "px";
		dot.style.height = dotSize + "px";

		dot.style.boxShadow = `0 0 ${dotSize * 2}px currentColor`;
		dot.style.color = `hsl(${random(
			baseHue - hueDiffusion,
			baseHue + hueDiffusion
		)}, 100%, 50%)`;

		animateDot(
			dot,
			`translate(${cos(i) * ringSize}px, ${sin(i) * ringSize}px) rotate(${random(
				-200,
				200
			)}deg)`
		);
	}

	for (let i = 0; i < 360; i += inc) {
		createDot(i);
	}

	return ringContainer;
}

// const patterns = [
// 	[1, 0.9, 0.8, 0.7, 0.6, 0.5], // ring
// 	[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2], // circle
// 	[1, 0.95, 0.7, 0.65, 0.6, 0.5, 0.55] // two rings
// ];

function createFirework(x, y) {
	const minDim = Math.min(window.innerWidth, window.innerHeight);
	const minSize = minDim / 5;
	const maxSize = Math.min(minDim / 1.2, 350);
	const baseSize = random(minSize, maxSize);

	const fireworkEl = document.createElement("div");
	fireworkEl.style.position = "fixed";
	fireworkEl.style.transform = `translate(${x}px, ${y}px)`;


	[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1].forEach((p) => {
		fireworkEl.append(createRing(baseSize * p));
	});

	document.body.append(fireworkEl);

	const shootUp = fireworkEl.animate(
		{
			transform: `translate(${x}px, ${y - 200}px)`
		},
		{
			duration: 1000,
			fill: "forwards",
			easing: "ease"
		}
	);

	shootUp.onfinish = async () => {
		// oop there goes gravity
		fireworkEl.animate(
			{
				transform: `translate(${x}px, ${y + 200}px)`
			},
			{
				duration: 24000,
				fill: "forwards",
				easing: "ease"
			}
		);
	};
	
	setTimeout(() => {
		fireworkEl.remove()
	}, 20000)
}

// auto fireworks
const id = setInterval(() => {
	const randomX = Math.random() * (window.innerWidth - 200);
	const randomY = Math.random() * (window.innerHeight - 200);
	createFirework(randomX, randomY);
}, 2500);



// click fireworks
document.body.addEventListener("click", (e) => {
	const x = e.clientX;
	const y = e.clientY;
	createFirework(x, y);
	clearInterval(id); // stop auto fireworks
});


// stop auto fireworks on window/tab blur
window.addEventListener("blur", () => {
	clearInterval(id); 
});

document.addEventListener("blur", () => {
	clearInterval(id); 
});