"use client";

import Image from "next/image";

const connectedLogos = [
	{
		label: "Interactive Brokers",
		src: "/images/Interactive_Brokers/Interactive_Brokers_id6265v1jK_0.svg",
		width: 220,
		height: 46,
	},
	{
		label: "Trade Republic",
		src: "/images/Trade_Republic/Trade_Republic_idPTCG7PGv_0.svg",
		width: 230,
		height: 40,
	},
];

export default function Connections() {
	const repeatCount = 6;
	const marqueeItems = Array.from({ length: repeatCount }, () => connectedLogos).flat();

	return (
		<section className="w-full px-6 pt-20 pb-0 sm:px-8 lg:px-16" id="connections">
			<p className="mx-auto max-w-3xl text-center font-serif font-bold text-5xl text-[#FFB95D]">
                Mile is Connected 
            </p>

			<div className="w-full">
				<div className="connections-marquee-shell">
					<div className="connections-marquee-track">
						{marqueeItems.map((logo, index) => (
							<div key={`${logo.label}-${index}`} className="connections-logo-item">
								<Image
									src={logo.src}
									alt={logo.label}
									width={logo.width}
									height={logo.height}
									className="connections-logo-image"
									loading={index < connectedLogos.length * 2 ? "eager" : "lazy"}
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			
		</section>
	);
}
