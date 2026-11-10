# füstképek: lámpakúp alakú és koktél mögötti foltos füst, átlátszó szélekkel (python3 forras/fust.py)
import numpy as np
from PIL import Image
OUT = '/home/user/darling/site/img/'

def smoke(W, H, seed, lx=260, ly=110):
    rng = np.random.default_rng(seed)
    fy = np.fft.fftfreq(H)[:, None]; fx = np.fft.fftfreq(W)[None, :]
    def field(a, b):
        n = rng.standard_normal((H, W))
        f = np.real(np.fft.ifft2(np.fft.fft2(n) * np.exp(-((fx * a) ** 2 + (fy * b) ** 2))))
        return (f - f.mean()) / f.std()
    f = field(lx, ly) * .7 + field(lx / 3, ly / 3) * .3
    g = field(lx * 2, ly * 2)
    yy, xx = np.mgrid[0:H, 0:W]
    f = f[yy, (xx + (g * 50).astype(int)) % W]
    f = (f - f.min()) / (f.max() - f.min())
    return np.clip((f - .38) / .45, 0, 1) ** 1.3

def save(name, a, col=(255, 216, 158)):
    im = Image.new('RGB', (a.shape[1], a.shape[0]), col)
    im.putalpha(Image.fromarray((np.clip(a, 0, 1) * 255).astype('uint8')))
    im.save(OUT + name, quality=80, method=6)

# lámpakúp: csúcs fent középen, kb. ±30 fok, lefelé halványul
W, H = 780, 540
yy, xx = np.mgrid[0:H, 0:W].astype(float)
dx, dy = xx - W / 2, yy + 6
ang = np.arctan2(np.abs(dx), dy)
cone = np.clip((0.56 - ang) / 0.4, 0, 1) ** 1.2
e = np.sqrt((dx / (W * .36)) ** 2 + (dy / H) ** 2)
cone *= np.clip((1 - e) / .75, 0, 1) ** 1.1
for i, s in enumerate([3, 8]):
    save('fust-kup-%d.webp' % (i + 1), smoke(W, H, s, 220, 90) * cone * .8)

# koktélkártyák mögött: lágy ellipszis
W, H = 960, 800
yy, xx = np.mgrid[0:H, 0:W].astype(float)
r = np.sqrt(((xx - W / 2) / (W * .5)) ** 2 + ((yy - H / 2) / (H * .5)) ** 2)
el = np.clip((1 - r) / .6, 0, 1) ** 1.4
for i, s in enumerate([21, 34]):
    save('fust-pult-%d.webp' % (i + 1), smoke(W, H, s, 300, 140) * el * .75)
print('ok')
