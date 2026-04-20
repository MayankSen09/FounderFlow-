const fs = require('fs');

const customCSS = `
/* Funnel Builder Custom Layers */
.mesh-bg {
    background-image: 
        radial-gradient(at 0% 0%, rgba(133, 173, 255, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(193, 128, 255, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(255, 109, 175, 0.15) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(255, 152, 0, 0.1) 0px, transparent 50%);
}

.funnel-layer {
    transition: all 0.4s ease;
    position: relative;
}

.funnel-layer::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.0));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
}

.layer-awareness { background: rgba(34, 38, 43, 0.6); box-shadow: 0 0 40px rgba(133, 173, 255, 0.2); border: 1px solid rgba(133, 173, 255, 0.3); }
.layer-interest { background: rgba(34, 38, 43, 0.5); box-shadow: 0 0 30px rgba(193, 128, 255, 0.1); border: 1px solid rgba(193, 128, 255, 0.15); }
.layer-consideration { background: rgba(34, 38, 43, 0.4); box-shadow: 0 0 20px rgba(255, 109, 175, 0.05); border: 1px solid rgba(255, 109, 175, 0.15); }
.layer-intent { background: rgba(34, 38, 43, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); }
.layer-evaluation { background: rgba(34, 38, 43, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); }
.layer-purchase { background: rgba(34, 38, 43, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); }
.layer-loyalty { background: rgba(34, 38, 43, 0.1); border: 1px solid rgba(255, 255, 255, 0.05); }

.active-layer-glow {
    box-shadow: 0 0 60px rgba(133, 173, 255, 0.4), inset 0 0 20px rgba(133, 173, 255, 0.2);
    border-color: #85adff;
}
`;

fs.appendFileSync('src/index.css', '\n' + customCSS);
console.log('Appended CSS successfully.');
