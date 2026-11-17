# JS csomag: gsap + ScrollTrigger + Lenis + main.js; a hang.js külön hang.min.js-be (tömörítve) -> site/js/app.min.js
# A forrás a site/js/main.js és a site/js/szovegek.js; szerkesztés után futtasd a repó gyökeréből: python3 forras/build.py
# (a site/index.html közvetlenül szerkesztendő; a régi index.src.html elavult volt, törölve)
import subprocess, os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
mn = subprocess.run(['npx', '--yes', 'terser@5.36.0', B + 'site/js/main.js', '-c', 'passes=2', '-m'], capture_output=True, text=True, check=True).stdout
hg = subprocess.run(['npx', '--yes', 'terser@5.36.0', B + 'site/js/hang.js', '-c', 'passes=2', '-m'], capture_output=True, text=True, check=True).stdout
js = '\n'.join(open(B + 'site/js/' + f).read() for f in ['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js']) + '\n' + mn
open(B + 'site/js/app.min.js', 'w').write(js)
open(B + 'site/js/hang.min.js', 'w').write(hg)  # a hang külön, a betöltés után töltődik (ne lassítsa a nyitóképet)
print('ok', len(js))
