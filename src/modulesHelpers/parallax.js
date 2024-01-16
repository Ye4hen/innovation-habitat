export default function initializeParallax() {
	const parallax = document.querySelector('.main-block__parallax');

	function handleScroll() {
		const scrolled = window.scrollY;
		parallax.style.transform = `translateY(-${scrolled * 0.1}px)`;
	}

	window.addEventListener('scroll', handleScroll);
}