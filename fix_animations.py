import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

react_script = """
  "use client";
  import { useEffect } from 'react';

  export default function Page() {
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hpc-animate--animated', 'animate--animated');
            // Some elements might have hpc-slider__slide--animated
            entry.target.classList.add('hpc-slider__slide--animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      const elements = document.querySelectorAll('.hpc-animate, .animate, .hpc-slider__slide, .hpc-pics__bg, .hpc-slider__layer');
      elements.forEach(el => observer.observe(el));
      
      return () => observer.disconnect();
    }, []);

"""

content = content.replace("export default function Page() {\n", react_script)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
