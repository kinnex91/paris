<script type="module">
import { motion } from 'https://cdn.skypack.dev/framer-motion';

const button = document.querySelector('.login-button');
button.addEventListener('mouseover', () => {
    button.style.transform = 'translateY(-5px)';
});
button.addEventListener('mouseout', () => {
    button.style.transform = 'translateY(0)';
});
</script>
