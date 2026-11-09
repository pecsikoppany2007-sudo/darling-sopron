// a hardveres GPU-ellenőrzés becsapása fej nélküli Chromiumban, hogy a 3D ágak is fussanak
(()=>{const g=WebGLRenderingContext.prototype.getParameter;WebGLRenderingContext.prototype.getParameter=function(p){if(p===0x9246)return 'ANGLE (Apple, Apple M2, OpenGL 4.1)';return g.call(this,p)}})();
