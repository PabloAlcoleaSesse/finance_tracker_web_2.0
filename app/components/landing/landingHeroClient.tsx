"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import * as THREE from "three";

class TouchTexture {
	private size = 64;
	private width = this.size;
	private height = this.size;
	private maxAge = 64;
	private radius = 0.25 * this.size;
	private speed = 1 / this.maxAge;
	private trail: Array<{ x: number; y: number; age: number; force: number; vx: number; vy: number }> = [];
	private last: { x: number; y: number } | null = null;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	texture: THREE.Texture;

	constructor() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		const context = this.canvas.getContext("2d");
		if (!context) {
			throw new Error("2D canvas context unavailable for touch texture");
		}
		this.ctx = context;
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.texture = new THREE.Texture(this.canvas);
	}

	update() {
		this.clear();
		const speed = this.speed;

		for (let i = this.trail.length - 1; i >= 0; i -= 1) {
			const point = this.trail[i];
			const forceStep = point.force * speed * (1 - point.age / this.maxAge);

			point.x += point.vx * forceStep;
			point.y += point.vy * forceStep;
			point.age += 1;

			if (point.age > this.maxAge) {
				this.trail.splice(i, 1);
			} else {
				this.drawPoint(point);
			}
		}

		this.texture.needsUpdate = true;
	}

	addTouch(point: { x: number; y: number }) {
		let force = 0;
		let vx = 0;
		let vy = 0;

		if (this.last) {
			const dx = point.x - this.last.x;
			const dy = point.y - this.last.y;
			if (dx === 0 && dy === 0) return;

			const dd = dx * dx + dy * dy;
			const d = Math.sqrt(dd);
			vx = dx / d;
			vy = dy / d;
			force = Math.min(dd * 20000, 2.0);
		}

		this.last = { x: point.x, y: point.y };
		this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
	}

	private clear() {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private drawPoint(point: { x: number; y: number; age: number; force: number; vx: number; vy: number }) {
		const posX = point.x * this.width;
		const posY = (1 - point.y) * this.height;

		let intensity = 1;
		if (point.age < this.maxAge * 0.3) {
			intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
		} else {
			const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
			intensity = -t * (t - 2);
		}

		intensity *= point.force;

		const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
		const offset = this.size * 5;

		this.ctx.shadowOffsetX = offset;
		this.ctx.shadowOffsetY = offset;
		this.ctx.shadowBlur = this.radius;
		this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

		this.ctx.beginPath();
		this.ctx.fillStyle = "rgba(255,0,0,1)";
		this.ctx.arc(posX - offset, posY - offset, this.radius, 0, Math.PI * 2);
		this.ctx.fill();
	}
}

function HeroThreeGradient() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const host = canvas.parentElement;
		if (!host) return;

		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		const touchTexture = new TouchTexture();

		const uniforms = {
			uTime: { value: 0 },
			uResolution: { value: new THREE.Vector2(1, 1) },
			uTouchTexture: { value: touchTexture.texture },
			uColorA: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
			uColorB: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
			uColorC: { value: new THREE.Vector3(0.251, 0.878, 0.816) },
		};

		const material = new THREE.ShaderMaterial({
			uniforms,
			transparent: true,
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				precision highp float;
				varying vec2 vUv;
				uniform float uTime;
				uniform vec2 uResolution;
				uniform sampler2D uTouchTexture;
				uniform vec3 uColorA;
				uniform vec3 uColorB;
				uniform vec3 uColorC;

				float grain(vec2 uv, float t) {
					float n = fract(sin(dot((uv * uResolution * 0.25) + t, vec2(12.9898, 78.233))) * 43758.5453);
					return n * 2.0 - 1.0;
				}

				void main() {
					vec2 uv = vUv;
					float t = uTime * 0.22;

					vec4 touch = texture2D(uTouchTexture, uv);
					float vx = -(touch.r * 2.0 - 1.0);
					float vy = -(touch.g * 2.0 - 1.0);
					float touchIntensity = touch.b;

					uv += vec2(vx, vy) * (0.12 * touchIntensity);

					vec2 c1 = vec2(0.22 + sin(t * 1.1) * 0.10, 0.28 + cos(t * 1.2) * 0.09);
					vec2 c2 = vec2(0.78 + cos(t * 0.9) * 0.11, 0.72 + sin(t * 1.0) * 0.10);
					vec2 c3 = vec2(0.50 + sin(t * 0.75) * 0.08, 0.50 + cos(t * 0.8) * 0.07);

					float g1 = 1.0 - smoothstep(0.0, 0.58, distance(uv, c1));
					float g2 = 1.0 - smoothstep(0.0, 0.62, distance(uv, c2));
					float g3 = 1.0 - smoothstep(0.0, 0.55, distance(uv, c3));

					vec3 color = vec3(0.02, 0.03, 0.07);
					color += uColorA * g1 * 0.38;
					color += uColorB * g2 * 0.68;
					color += uColorC * g3 * 0.14;

					float vignette = smoothstep(1.25, 0.15, distance(uv, vec2(0.5)));
					color *= (0.82 + vignette * 0.28);
					color += grain(uv, uTime) * 0.015;

					gl_FragColor = vec4(color, 0.72);
				}
			`,
		});

		const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
		scene.add(mesh);

		const onPointerMove = (event: PointerEvent) => {
			const rect = host.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width;
			const y = 1 - (event.clientY - rect.top) / rect.height;
			touchTexture.addTouch({ x: THREE.MathUtils.clamp(x, 0, 1), y: THREE.MathUtils.clamp(y, 0, 1) });
		};

		const onTouchMove = (event: TouchEvent) => {
			const touch = event.touches[0];
			if (!touch) return;
			onPointerMove({ clientX: touch.clientX, clientY: touch.clientY } as PointerEvent);
		};

		const resize = () => {
			const width = Math.max(host.clientWidth, 1);
			const height = Math.max(host.clientHeight, 1);
			renderer.setSize(width, height, false);
			uniforms.uResolution.value.set(width, height);
		};

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(host);
		host.addEventListener("pointermove", onPointerMove);
		host.addEventListener("touchmove", onTouchMove, { passive: true });

		resize();

		let rafId = 0;
		const tick = () => {
			touchTexture.update();
			uniforms.uTime.value = performance.now() / 1000;
			renderer.render(scene, camera);
			rafId = window.requestAnimationFrame(tick);
		};

		tick();

		return () => {
			window.cancelAnimationFrame(rafId);
			host.removeEventListener("pointermove", onPointerMove);
			host.removeEventListener("touchmove", onTouchMove);
			resizeObserver.disconnect();
			mesh.geometry.dispose();
			material.dispose();
			touchTexture.texture.dispose();
			renderer.dispose();
		};
	}, []);

	return <canvas ref={canvasRef} className="hero-three-gradient" aria-hidden="true" />;
}

export default function LandingHeroClient({ sectionId }: { sectionId?: string }) {
	const paragraphRef = useRef<HTMLParagraphElement>(null);
	const sentenceParts = [
		{ text: "Mile is a modern " },
		{ text: "investment tracking", highlight: true },
		{ text: " platform designed to give users complete " },
		{ text: "clarity", highlight: true },
		{ text: " and " },
		{ text: "control", highlight: true },
		{ text: " over their portfolios." },
	] as const;

	useEffect(() => {
		if (!paragraphRef.current) return;

		const paragraph = paragraphRef.current;
		const scheduled: number[] = [];
		const words = Array.from(paragraph.querySelectorAll<HTMLElement>(".hero-word"));

		words.forEach((word, index) => {
			const start = window.setTimeout(() => {
				word.style.opacity = "1";
				word.style.transform = "translateY(0px)";
			}, 200 + index * 70);
			scheduled.push(start);
		});

		return () => {
			scheduled.forEach((id) => window.clearTimeout(id));
		};
	}, []);

	let wordIndex = 0;

	const renderWordTokens = (text: string, keyPrefix: string) => {
		const tokens = text.split(/(\s+)/);
		return tokens.map((token, tokenIndex) => {
			if (/^\s+$/.test(token)) {
				return token;
			}

			const delay = 200 + wordIndex * 70;
			wordIndex += 1;

			return (
				<span
					key={`${keyPrefix}-${tokenIndex}`}
					className="hero-word inline-block"
					style={{
						opacity: 0,
						transform: "translateY(20px)",
						transitionProperty: "transform, opacity",
						transitionDuration: "700ms",
						transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
						transitionDelay: `${delay}ms`,
					}}
				>
					{token}
				</span>
			);
		});
	};

	return (
		<section
			id={sectionId}
			className="relative m-10 flex h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/15 text-center md:m-6 md:h-[calc(100vh-3rem)] md:w-[calc(100vw-3rem)]"
		>
			<div className="hero-gradient-bg" aria-hidden="true" />
			<HeroThreeGradient />
			<div className="absolute inset-0 bg-black/18" aria-hidden="true" />
			<Image
				src="/logo/Logo.svg"
				alt="WSPort logo"
				width={1}
				height={1}
				className="absolute left-1/2 top-1/2 z-10 w-[min(74vw,42rem)] -translate-x-1/2 -translate-y-1/2"
			/>
			<p ref={paragraphRef} className="absolute bottom-[20%] z-20 max-w-[min(90vw,64rem)] px-4 text-2xl font-sans font-regular text-white sm:text-3xl md:text-4xl">
				{sentenceParts.map((part, partIndex) => {
					if (!("highlight" in part && part.highlight)) {
						return (
							<span key={`part-${partIndex}`}>
								{renderWordTokens(part.text, `word-${partIndex}`)}
							</span>
						);
					}

					return (
						<span
							key={`part-${partIndex}`}
							className="font-serif text-[#FFB95D]"
						>
							{renderWordTokens(part.text, `highlight-${partIndex}`)}
						</span>
					);
				})}
			</p>

			<button className="w-full flex justify-center">
				<span className="absolute bottom-8 z-20  rounded-full border-4 border-white/50 p-5 transition-colors hover:border-[#FFB95D] hover:text-[#FFB95D]">
					<p className="text-lg text-white/80 font-black">Get Started</p>
				</span>
					
			</button>
		</section>
	);
}
